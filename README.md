# TIRP Hybrid (Auto‑Encoder + Random Forest)

**Generated:** 2025-05-18T02:16:26.866117 UTC

## Prerequisites
* Python 3.10+
* Node 20+
* (Optional) Docker Desktop

## Quick start (local dev)

```bash
# 1. Train the model (uses backend/ml/train.py)
cd backend/ml
python train.py --csv train_dataset.csv

# 2. Start the API
cd ..
pip install -r requirements.txt
python app.py

# 3. Fire up the React dev server
cd ../../frontend
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Docker Compose
```bash
docker compose up --build
```

## Notes
* The **Auto‑Encoder** learns latent features; the **Random Forest** classifies.
* Edit `backend/ml/train.py` to tweak model hyper‑parameters.
* Front‑end proxy (Vite) forwards `/predict` to `localhost:8000`.
