# WellAware

### Notice earlier. Support sooner.

**WellAware** is an explainable, ML-assisted Student Wellbeing Early Warning & Support System designed to help university support teams identify meaningful changes in observable academic and engagement signals and consider an earlier human check-in.

> **Detect → Explain → Check In → Support**

WellAware is designed as an **assistive decision-support system**, not a medical or mental-health diagnosis tool.

<img width="2880" height="1558" alt="image" src="https://github.com/user-attachments/assets/2835313b-ceb9-4537-8f00-2cf10a4a755a" />

---

## 🚨 Problem

Universities can have access to many student signals, but those signals are often fragmented across different systems and departments.

For the challenge scenario, the university is experiencing:

- A **40% increase in mental-health referrals**
- Support fragmented across **12 departments**
- Students waiting up to **three weeks** for a first appointment

The challenge asks teams to design focused, user-centred solutions that help students and support teams respond earlier. :contentReference[oaicite:1]{index=1}

### The problem we focused on

A student may show several meaningful changes over time:

- Attendance declining
- More classes being missed
- Assignment completion falling
- More late submissions
- Academic performance declining
- Engagement declining

Individually, these signals may not mean much.

Together, however, they may indicate that an **earlier human check-in could be worth considering**.

The challenge is therefore not simply finding a single problematic metric.

It is helping support teams notice **patterns earlier**.

---

# 💡 Solution

WellAware combines observable student signals into an explainable **Support Priority** assessment:

| Priority | Meaning |
|---|---|
| 🟢 LOW | No immediate support-priority signal from the model |
| 🟡 MEDIUM | Signals worth reviewing |
| 🔴 HIGH | Earlier human review/check-in may be appropriate |

The system then explains the main factors contributing to the prediction using **SHAP**.

Instead of:

> "AI says HIGH"

WellAware aims to answer:

> "Why did the model produce this assessment?"

For example:

- Assignment completion is 55%
- 4 late submissions recorded
- 8 classes were missed
- Attendance fell by 24 percentage points
- 3 assignments were missed

The final decision remains with an **authorized human support professional**.

---

# 🎯 Challenge Track

**Selected Track:**  
### 02 — Early Warning System

The challenge describes this track as:

> Spot students who may need help before crisis.

WellAware addresses this by identifying patterns in observable academic and engagement signals and surfacing them for human review.

---

# 🧠 ML Approach

## Problem Type

**Multiclass classification**

Target:

```text
0 → LOW
1 → MEDIUM
2 → HIGH
````

The model estimates:

```text
P(LOW)
P(MEDIUM)
P(HIGH)
```

and applies a configurable HIGH-priority threshold.

---

# 📊 Dataset

## Synthetic Demonstration Dataset

We created a **5,000-record synthetic dataset** specifically for this prototype.

We intentionally used synthetic data because student wellbeing data is sensitive and we did not want to present a prototype as though it had been trained on real institutional mental-health records.

The dataset is therefore intended to demonstrate the **technical workflow**, not to claim real-world clinical or institutional validity.

### Dataset

```text
Records:        5,000
Input features: 10
Target:          support_priority
```

### Class distribution

```text
LOW       1,899   (37.98%)
MEDIUM    2,174   (43.48%)
HIGH        927   (18.54%)
```

---

# 🧩 Features

The model uses 10 observable academic and engagement features.

| Feature                 | Description                           |
| ----------------------- | ------------------------------------- |
| `attendance_rate`       | Current attendance percentage         |
| `attendance_change`     | Recent change in attendance           |
| `assignment_completion` | Percentage of assignments completed   |
| `missed_assignments`    | Number of missed assignments          |
| `average_grade`         | Current average academic grade        |
| `grade_change`          | Recent change in academic performance |
| `late_submissions`      | Number of late submissions            |
| `engagement_score`      | Current engagement score              |
| `engagement_change`     | Recent change in engagement           |
| `classes_missed`        | Number of missed classes              |

### Why include "change" features?

A snapshot is not always enough.

For example:

```text
Week 1 attendance: 88%
Week 4 attendance: 62%
```

The current attendance is 62%, but the **24-point decline** provides additional temporal context.

This is why the model includes:

```text
attendance_change
grade_change
engagement_change
```

---

# 🔍 Exploratory Data Analysis

Before training the models, we analyzed:

* Descriptive statistics
* Class distributions
* Group means
* Feature correlations
* Feature distributions

The improved synthetic dataset showed a coherent pattern:

```text
LOW → MEDIUM → HIGH
```

as:

```text
Attendance                  ↓
Assignment completion       ↓
Missed assignments           ↑
Late submissions             ↑
Grade change                 ↓
Engagement                   ↓
Engagement change            ↓
Classes missed               ↑
```

This gave the synthetic dataset a more meaningful structure for the prototype.

---

# 🧪 Model Experiments

We compared three classification approaches:

### 1. Logistic Regression

Used as an interpretable baseline for multiclass classification.

### 2. Random Forest

Used to test a tree-based ensemble approach.

### 3. XGBoost

Used to test a gradient-boosted tree approach.

We did not assume that a more complex model would automatically perform better.

---

# 📈 Cross-Validation Results

We used **5-fold stratified cross-validation** to compare the models.

| Model                   |   Accuracy | Macro Precision | Macro Recall |   Macro F1 |
| ----------------------- | ---------: | --------------: | -----------: | ---------: |
| **Logistic Regression** | **70.82%** |      **72.32%** |   **69.45%** | **70.60%** |
| Random Forest           |     68.76% |          68.36% |       69.25% |     68.74% |
| XGBoost                 |     69.24% |          70.46% |       67.73% |     68.82% |

Based on the cross-validation results, **Logistic Regression was selected as the final model** for the prototype.

---

# ⚖️ HIGH-Class Trade-off

Because WellAware is an early-warning system, we paid particular attention to the HIGH class.

Initial HIGH-class performance:

| Model               | HIGH Precision | HIGH Recall |    HIGH F1 |
| ------------------- | -------------: | ----------: | ---------: |
| Logistic Regression |     **76.02%** |      62.68% | **68.62%** |
| Random Forest       |         65.66% |  **69.80%** |     67.63% |
| XGBoost             |         72.87% |      60.30% |     65.95% |

This highlighted a real product trade-off:

```text
Higher HIGH recall
        ↕
Fewer false HIGH alerts
```

A highly sensitive system can surface more students, but may also produce more alerts for staff to review.

---

# 🎚️ Threshold Tuning

Instead of relying only on the default maximum-probability class, we evaluated different thresholds for the HIGH class.

Tested thresholds:

```text
0.30
0.35
0.40
0.45
0.50
0.55
0.60
0.65
0.70
```

We selected:

```text
HIGH_THRESHOLD = 0.40
```

using the validation set.

### Final decision logic

```python
if P(HIGH) >= 0.40:
    prediction = HIGH
else:
    prediction = LOW or MEDIUM
    # whichever has the higher probability
```

This threshold is a **prototype operating point**, not a clinically validated threshold.

---

# 🧪 Proper Train / Validation / Test Design

To prevent threshold tuning from contaminating the final evaluation, we used:

```text
60% Training
20% Validation
20% Final Test
```

### Final split

```text
Training:       3,000
Validation:     1,000
Final Test:     1,000
```

Stratification was used so that the LOW/MEDIUM/HIGH class proportions remained consistent across the splits.

### Workflow

```text
Dataset
   │
   ├───────────────┐
   ↓               ↓
TRAIN          Validation
   │               │
Train model     Tune threshold
   │               │
   └───────┬───────┘
           ↓
      Locked model
           │
           ↓
     Final Test
```

The final test set was not used to choose the threshold.

---

# 🏁 Final Model

### Model

**Logistic Regression**

### Preprocessing

**StandardScaler**

### Decision threshold

```text
HIGH probability >= 0.40
```

### Final test performance

| Metric          | Result |
| --------------- | -----: |
| Accuracy        |   ~70% |
| Macro Precision |   ~70% |
| Macro Recall    |   ~71% |
| Macro F1        |   ~70% |
| HIGH Precision  |   ~68% |
| HIGH Recall     |   ~71% |
| HIGH F1         |   ~70% |

### Final confusion matrix

```text
                 Predicted
              LOW  MEDIUM HIGH

Actual LOW    294    85     1
Actual MEDIUM  98   276    61
Actual HIGH     3    50   132
```

The final test set contained 185 HIGH examples, of which 132 were correctly classified as HIGH.

```text
HIGH recall ≈ 71.4%
```

---

# 🔍 Explainable AI with SHAP

A prediction by itself is not enough for a support workflow.

WellAware therefore uses **SHAP (SHapley Additive exPlanations)** to identify which features contributed most strongly to an individual prediction.

### Example

For the demonstration student **Arjun Kumar**:

```text
HIGH probability: 60.5%
```

The strongest positive contributors toward the HIGH class included:

```text
Assignment completion
Late submissions
Classes missed
Attendance change
Missed assignments
```

The system converts the model contribution into human-readable explanations.

Example:

```text
Assignment completion is 55%.

4 late submissions recorded.

8 classes were missed.

Attendance fell by 24 percentage points.

3 assignments were missed.
```

The UI does not require support staff to understand raw SHAP values.

---

# 👤 Dynamic Prediction

Arjun is **not hardcoded into the model**.

The same trained model accepts arbitrary student inputs.

For example:

### Low-type example

```text
Attendance rate:       92%
Attendance change:     -2
Assignment completion: 95%
Missed assignments:     0
Average grade:         84%
Grade change:          -1
Late submissions:       0
Engagement score:      86
Engagement change:     -3
Classes missed:         1
```

Output from the model:

```text
LOW ≈ 98.53%
MEDIUM ≈ 1.47%
HIGH ≈ 0%
```

### High-type example

A substantially different input produced:

```text
LOW ≈ 0.01%
MEDIUM ≈ 4.71%
HIGH ≈ 95.28%
```

This demonstrates that the system performs inference dynamically on new inputs.

---

# 🏗️ System Architecture

```text
                     WELLAWARE
                         │
                         ▼
              ┌────────────────────┐
              │   React Frontend   │
              │                    │
              │ Dashboard          │
              │ Students           │
              │ Student Profile    │
              │ Analyze Student    │
              │ Check-in           │
              └─────────┬──────────┘
                        │
                   HTTP POST
                   /predict
                        │
                        ▼
              ┌────────────────────┐
              │      FastAPI       │
              │       API          │
              └─────────┬──────────┘
                        │
                ┌───────┴────────┐
                ▼                ▼
       ┌────────────────┐  ┌───────────────┐
       │ Logistic       │  │     SHAP      │
       │ Regression     │  │ Explanation   │
       │ + StandardScaler│  │               │
       └───────┬────────┘  └───────┬───────┘
               │                   │
               └─────────┬─────────┘
                         ▼
                 JSON Prediction
                         │
                         ▼
                  React Dashboard
```

---

# 🔌 API

The ML service is exposed through FastAPI.

## Health Check

```http
GET /health
```

Example:

```json
{
  "status": "healthy",
  "model": "Logistic Regression",
  "shap": true
}
```

---

## Prediction

```http
POST /predict
```

### Request

```json
{
  "attendance_rate": 62,
  "attendance_change": -24,
  "assignment_completion": 55,
  "missed_assignments": 3,
  "average_grade": 68,
  "grade_change": -11,
  "late_submissions": 4,
  "engagement_score": 35,
  "engagement_change": -20,
  "classes_missed": 8
}
```

### Response

```json
{
  "prediction": "HIGH",
  "probabilities": {
    "LOW": 0.0066,
    "MEDIUM": 0.3884,
    "HIGH": 0.605
  },
  "threshold": 0.4,
  "explanations": [
    {
      "feature": "Assignment completion",
      "value": 55,
      "impact": 0.7336,
      "explanation": "Assignment completion is 55%."
    },
    {
      "feature": "Late submissions",
      "value": 4,
      "impact": 0.6289,
      "explanation": "4 late submissions recorded."
    }
  ],
  "recommended_action": "Consider a human advisor check-in",
  "disclaimer": "AI-generated support priority. This is an assistive signal, not a diagnosis. Authorized staff review is required."
}
```

---

# 🖥️ Product Workflow

The primary user journey is:

```text
Dashboard
    ↓
Select Student
    ↓
Analyze Observable Signals
    ↓
ML Support Priority
    ↓
Explain Why
    ↓
Human Review
    ↓
Start Check-in
    ↓
Offer Support
```

The live analysis workflow also allows authorized users to enter a new student's observable signal values and request a new prediction.

```text
Enter Student Signals
        ↓
POST /predict
        ↓
Logistic Regression
        ↓
Probability Output
        ↓
Threshold Decision
        ↓
SHAP Explanation
        ↓
Support Recommendation
```

---

# 🔐 Safety & Governance

WellAware is intentionally designed as **human-in-the-loop decision support**.

The model:

* Does not diagnose mental-health conditions
* Does not make clinical decisions
* Does not automatically contact students
* Does not make disciplinary decisions
* Does not suspend or punish students
* Does not replace counsellors or advisors

The intended workflow is:

```text
AI signal
   ↓
Human review
   ↓
Human decision
   ↓
Student support
```

### Important limitation

The current model is trained on **synthetic demonstration data**.

Therefore:

> The reported model performance should not be interpreted as evidence of real-world wellbeing prediction capability.

A production deployment would require, at minimum:

* Properly governed institutional data
* Privacy and security controls
* Data-quality validation
* Bias/fairness analysis
* Prospective validation
* Domain-expert review
* Institutional governance
* Ongoing monitoring

---

# 📁 Project Structure

```text
WellAware/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   │   └── mlApi.ts
│   │   ├── data/
│   │   │   └── students.ts
│   │   └── ...
│   └── package.json
│
├── backend/
│   ├── main.py
│   ├── venv313/
│   └── ...
│
├── ml/
│   ├── wellaware_model.pkl
│   ├── feature_names.pkl
│   └── shap_background.csv
│
└── README.md
```

---

# ⚙️ Local Setup

## 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd WellAware
```

---

## 2. Start the ML backend

Navigate to the backend:

```bash
cd backend
```

Create/activate the Python environment:

```bash
py -3.13 -m venv venv313
venv313\Scripts\activate
```

Install dependencies:

```bash
pip install fastapi uvicorn pandas numpy scikit-learn joblib shap
```

Run the API:

```bash
uvicorn main:app --reload
```

The API will run at:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

Health check:

```text
http://127.0.0.1:8000/health
```

---

# 🎨 Frontend Setup

From the frontend directory:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

The frontend communicates with:

```text
http://127.0.0.1:8000
```

through:

```http
POST /predict
```

---

# 🧪 Testing the ML API

Open:

```text
http://127.0.0.1:8000/docs
```

Navigate to:

```text
POST /predict
```

Click:

```text
Try it out
```

Enter a valid student feature vector and execute the request.

The API returns:

* Support Priority
* Class probabilities
* HIGH threshold
* Explainability signals
* Recommended action
* Safety disclaimer

---

# 🚀 Demo Scenario

For a live demonstration, use the following workflow:

### 1. Open WellAware

Show the overview dashboard.

### 2. Open Arjun Kumar

Show his observable signals.

### 3. Run live ML analysis

The frontend sends the feature vector to:

```text
POST /predict
```

### 4. Show the result

```text
HIGH
60.5%
```

### 5. Explain the prediction

Show the top contributing signals from SHAP.

### 6. Start a human check-in

Show available support pathways.

### 7. Analyze another student

Change the input values and run the model again.

This demonstrates that the model is dynamic and not hardcoded to a single example.

---

# 📌 Design Principles

WellAware follows five core principles:

### 1. Explainable

Every prediction should provide understandable supporting signals.

### 2. Human-in-the-loop

AI assists; authorized humans make decisions.

### 3. Privacy-aware

Avoid unnecessary sensitive or clinical information.

### 4. Action-oriented

The model should lead to a practical next step rather than just producing a number.

### 5. Simple and focused

The challenge explicitly emphasizes a focused prototype, clear user journey and impact over unnecessary complexity. 

---

# 🔮 Future Improvements

A production-grade version could explore:

* Longitudinal time-series modelling
* Real institutional data with appropriate governance
* Calibrated probability estimates
* Fairness and subgroup analysis
* Drift monitoring
* More robust threshold optimization
* Human feedback loops
* Role-based authentication
* PostgreSQL
* Secure audit logging
* Integration with existing university support systems
* Institution-specific support workflows

Any future clinical or wellbeing-related deployment would require substantially stronger validation and governance than this prototype.

---

# 🏆 Innovation Summary

WellAware is not designed to replace university support teams.

It is designed to help them **notice meaningful changes earlier**.

Its key innovation is the combination of:

```text
Observable Student Signals
          +
Machine Learning
          +
Explainable AI
          +
Human-in-the-Loop Support
```

The system moves the workflow from:

```text
Wait for crisis
     ↓
Student seeks help
     ↓
Support begins
```

toward:

```text
Signals change
     ↓
AI surfaces pattern
     ↓
Human reviews
     ↓
Earlier check-in can be considered
     ↓
Support
```

---

# ⚠️ Disclaimer

**WellAware is a prototype built for innovation demonstration purposes.**

The current ML model was trained using synthetic demonstration data and has not been clinically validated.

Its output is an **assistive Support Priority signal**, not a diagnosis, medical assessment, or substitute for professional judgement.

All consequential decisions should remain under appropriate human oversight.

---

# 👥 Team

**Project:** WellAware
**Challenge:** Co-Innovation Day — Student Challenge
**Track:** Early Warning System

Built as a student innovation prototype focused on student wellbeing and campus support.

