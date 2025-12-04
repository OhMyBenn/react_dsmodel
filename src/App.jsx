import React, { useState } from "react";
import axios from "axios";

export default function CreateDiabetes() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [Pregnancies, setPregnancies] = useState("");
  const [Glucose, setGlucose] = useState("");
  const [BloodPressure, setBloodPressure] = useState("");
  const [SkinThickness, setSkinThickness] = useState("");
  const [Insulin, setInsulin] = useState("");
  const [BMI, setBMI] = useState("");
  const [DiabetesPedigreeFunction, setDiabetesPedigreeFunction] = useState("");
  const [Age, setAge] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setPrediction(null);
    if (
      !Pregnancies ||
      !Glucose ||
      !BloodPressure ||
      !SkinThickness ||
      !Insulin ||
      !BMI ||
      !DiabetesPedigreeFunction ||
      !Age
    ) {
      setError("Semua data harus diisi");
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://ds-model-production-07dc.up.railway.app/predict",
        {
          Pregnancies,
          Glucose,
          BloodPressure,
          SkinThickness,
          Insulin,
          BMI,
          DiabetesPedigreeFunction,
          Age,
        }
      );
      if (response.status === 200) {
        setSuccess("Prediksi berhasil");
        const data = response.data;
        setPrediction({
          label:
            data.prediction === 1 || data.prediction === "1"
              ? "Positif"
              : "Negatif",
          probabilities: data.probabilities ?? null,
          raw: data,
        });
      } else {
        setError("Prediksi gagal");
      }
    } catch (error) {
      setError("Prediksi error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: "1100px" }}>
      <div className="mb-4">
        <h1 className="fw-bold">Prediksi Diabetes</h1>
      </div>
      {error && (
        <div className="alert alert-danger" style={{ borderRadius: "8px" }}>
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success" style={{ borderRadius: "8px" }}>
          {success}
        </div>
      )}

      <div
        className="card border-0 shadow-sm mb-4"
        style={{ borderRadius: "12px" }}>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-3 mb-3">
                <label className="form-label">Pregnancies</label>
                <input
                  type="number"
                  className="form-control bg-light border-0"
                  value={Pregnancies}
                  onChange={(e) => setPregnancies(e.target.value)}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Glucose</label>
                <input
                  type="number"
                  className="form-control bg-light border-0"
                  value={Glucose}
                  onChange={(e) => setGlucose(e.target.value)}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Blood Pressure</label>
                <input
                  type="number"
                  className="form-control bg-light border-0"
                  value={BloodPressure}
                  onChange={(e) => setBloodPressure(e.target.value)}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Skin Thickness</label>
                <input
                  type="number"
                  className="form-control bg-light border-0"
                  value={SkinThickness}
                  onChange={(e) => setSkinThickness(e.target.value)}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3 mb-3">
                <label className="form-label">Insulin</label>
                <input
                  type="number"
                  className="form-control bg-light border-0"
                  value={Insulin}
                  onChange={(e) => setInsulin(e.target.value)}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">BMI</label>
                <input
                  type="number"
                  className="form-control bg-light border-0"
                  value={BMI}
                  onChange={(e) => setBMI(e.target.value)}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Diabetes Pedigree Function</label>
                <input
                  type="number"
                  className="form-control bg-light border-0"
                  value={DiabetesPedigreeFunction}
                  onChange={(e) => setDiabetesPedigreeFunction(e.target.value)}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control bg-light border-0"
                  value={Age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold"
              style={{ borderRadius: "8px", padding: "12px 0" }}>
              {isLoading ? "Loading..." : "Predict"}
            </button>
          </form>
        </div>
      </div>

      {prediction && (
        <div
          className="card border-0 shadow-sm"
          style={{
            borderRadius: "16px",
            padding: "20px",
          }}>
          <div className="card-body">
            <h2 className="fw-bold mb-3">Hasil Prediksi</h2>
            <div className="mt-4">
              <h5 className="fw-semibold">Response Data:</h5>
              <div
                className="p-3 rounded"
                style={{
                  background: "#f8f9fa",
                  fontSize: "13px",
                  overflow: "auto",
                }}>
                <pre className="mb-0">
                  <div>Prediction: {prediction.prediction}</div>
                  {JSON.stringify(prediction.raw, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}