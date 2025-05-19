"""CLI wrapper around backend prediction for quick batch scoring"""
import argparse, pandas as pd, joblib, tensorflow as tf, os, json

parser = argparse.ArgumentParser()
parser.add_argument("--csv", required=True, help="CSV to score")
args = parser.parse_args()

MODEL_DIR = os.path.join(os.path.dirname(__file__), "ml")
encoder = tf.keras.models.load_model(os.path.join(MODEL_DIR, "encoder.h5"), compile=False)
rf      = joblib.load(os.path.join(MODEL_DIR, "rf.pkl"))

df = pd.read_csv(args.csv)
feats = encoder.predict(df.values)
preds = rf.predict(feats)
confs = rf.predict_proba(feats).max(axis=1)

print(json.dumps({
    "predictions": preds.tolist(),
    "confidence": confs.tolist()
}, indent=2))
