#!/usr/bin/env python3
"""
Train an Auto-Encoder + Random Forest hybrid for TIRP.

Usage
-----
python train.py --csv train_dataset.csv --label-col attack_type \
                --latent-dim 32 --epochs 30

Outputs (in backend/ml/)
------------------------
encoder.h5             : Keras encoder
rf.pkl                 : RandomForest model
feature_columns.pkl    : list of column names after one-hot
scaler.pkl             : StandardScaler fitted on training data
"""
import argparse, os, pickle
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report
import tensorflow as tf
from tensorflow.keras import layers, models

# ---------------------------------------------------------------------
def parse_args():
    ap = argparse.ArgumentParser()
    ap.add_argument("--csv", required=True, help="Path to labelled CSV")
    ap.add_argument("--label-col", default="label",
                    help="Target column header (default: 'label')")
    ap.add_argument("--latent-dim", type=int, default=32,
                    help="Size of AE latent space")
    ap.add_argument("--epochs", type=int, default=30,
                    help="Epochs for AE training")
    return ap.parse_args()

# ---------------------------------------------------------------------
def clean_encode(df: pd.DataFrame, label_col: str):
    """Return (X_df, y, feature_columns) with text cols one-hot encoded."""
    if label_col not in df.columns:
        raise ValueError(f"‘{label_col}’ column not found in CSV headers\n"
                         f"Available: {list(df.columns)}")

    X_df = df.drop(label_col, axis=1).copy()

    # One-hot encode object / category data
    cat_cols = X_df.select_dtypes(include=['object', 'category']).columns
    if len(cat_cols):
        X_df = pd.get_dummies(X_df, columns=cat_cols, drop_first=True)

    # Replace inf & NaN after casting to float32
    X_df = (X_df
            .replace([np.inf, -np.inf], np.nan)
            .fillna(0)
            .astype("float32"))

    return X_df, df[label_col].values, list(X_df.columns)

# ---------------------------------------------------------------------
def build_autoencoder(input_dim: int, latent: int):
    inp = layers.Input(shape=(input_dim,))
    enc = layers.Dense(128, activation='relu')(inp)
    enc = layers.Dense(latent, activation='relu')(enc)
    dec = layers.Dense(128, activation='relu')(enc)
    out = layers.Dense(input_dim, activation='sigmoid')(dec)

    auto = models.Model(inp, out, name="autoencoder")
    auto.compile(optimizer='adam', loss='mse')

    encoder = models.Model(inp, enc, name="encoder")
    return auto, encoder

# ---------------------------------------------------------------------
def main():
    args = parse_args()
    df = pd.read_csv(args.csv)

    # --- prepare features -------------------------------------------------
    X_df, y, feat_cols = clean_encode(df, args.label_col)

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_df.values).astype("float32")

    X_tr, X_val, y_tr, y_val = train_test_split(
        X_scaled, y, test_size=0.20, stratify=y, random_state=42)

    # --- train AutoEncoder ------------------------------------------------
    auto, encoder = build_autoencoder(X_tr.shape[1], args.latent_dim)
    auto.fit(X_tr, X_tr,
             validation_data=(X_val, X_val),
             epochs=args.epochs,
             batch_size=256,
             verbose=2)

    # --- encode & train Random Forest ------------------------------------
    X_tr_enc = encoder.predict(X_tr)
    X_val_enc = encoder.predict(X_val)

    rf = RandomForestClassifier(
        n_estimators=300,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1
    )
    rf.fit(X_tr_enc, y_tr)

    print("\nValidation performance:\n",
          classification_report(y_val, rf.predict(X_val_enc)))

    # --- persist artefacts ----------------------------------------------
    os.makedirs("ml", exist_ok=True)
    encoder.save("ml/encoder.h5")
    joblib.dump(rf, "ml/rf.pkl")
    pickle.dump(feat_cols, open("ml/feature_columns.pkl", "wb"))
    pickle.dump(scaler, open("ml/scaler.pkl", "wb"))
    print("\nSaved models to backend/ml/")

# ---------------------------------------------------------------------
if __name__ == "__main__":
    main()
