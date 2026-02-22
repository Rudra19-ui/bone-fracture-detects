# Bone-Fracture-Detection

## 1. Project Identity
**Bone-Fracture-Detection** is a research-prototype medical imaging system designed to classify X-ray images. It utilizes deep learning (ResNet50) to automatically identify the body part (Elbow, Hand, or Shoulder) and detect the presence of bone fractures.

*   **Status**: Research Prototype (Academic).
*   **Type**: Computer Vision / Medical AI.

## 2. Problem Definition
*   **Problem**: Misdiagnosis and overlooked fractures in X-ray images, particularly subtle hair-line fractures.
*   **Importance**: Fractures are common injuries. Missed diagnoses (false negatives) lead to delayed treatment, chronic pain, and poor healing. Radiologists often face high workloads and fatigue, increasing error rates.
*   **Current Solution**: Manual review by Radiologists and Orthopedic Surgeons.
*   **AI Role**: Acts as an automated decision support tool to screen images, flag potential fractures, and provide a "second opinion" to reduce human error.

## 3. Intended Usage & Boundaries
*   **Intended Users**: Medical researchers, students, and radiologists (experimental aid).
*   **Prohibited Users**: Patients for self-diagnosis.
*   **Nature**: **Decision Support Only**. It does NOT provide a definitive medical diagnosis.
*   **Disclaimer**: This software is for **research purposes only**. It has not been approved by the FDA or any medical regulatory body. Results should always be verified by a qualified medical professional.

## 4. Dataset Details
*   **Dataset Name**: MURA (Musculoskeletal Radiographs) Subset.
*   **Availability**: Public (Stanford ML Group).
*   **Source**: [MURA Dataset](https://stanfordmlgroup.github.io/competitions/mura/)
*   **Modality**: X-Ray (Radiographs).
*   **Classes**:
    *   **Body Parts**: 3 (Elbow, Hand, Shoulder).
    *   **Conditions**: 2 (Fractured, Normal).
*   **Size**: 20,335 images.
    *   **Elbow**: 5,396 (Normal: 3,160 | Fractured: 2,236)
    *   **Hand**: 6,003 (Normal: 4,330 | Fractured: 1,673)
    *   **Shoulder**: 8,936 (Normal: 4,496 | Fractured: 4,440)
*   **Split**: 72% Training, 18% Validation, 10% Testing.

## 5. Model Details
*   **Architecture**: ResNet50 (Transfer Learning from ImageNet).
*   **Input**: 224x224 pixels, 3 Channels (RGB).
*   **Outputs**:
    *   **Part Model**: 3 Classes (Softmax: Elbow, Hand, Shoulder).
    *   **Fracture Models**: 2 Classes (Softmax: Fractured, Normal) - Specialized model per body part.
*   **Loss Function**: Categorical Crossentropy.
*   **Optimizer**: Adam (Learning Rate: 0.0001).
*   **Training Strategy**:
    *   Base layers (ResNet50) frozen (non-trainable).
    *   Custom Classification Head: Dense(128, ReLU) → Dense(50, ReLU) → Dense(Output, Softmax).
*   **Hyperparameters**: 25 Epochs, Batch Size 64 (Train) / 32 (Test).

## 6. Training & Evaluation Flow
*   **Training Strategy**: Transfer learning to leverage pre-trained features, followed by fine-tuning the custom head.
*   **Validation**: 20% of the training set is reserved for validation during training to monitor performance.
*   **Metrics**: Accuracy, Loss.
*   **Key Medical Metric**: Sensitivity (Recall) is prioritized to minimize missed fractures.
*   **Overfitting Control**: Early Stopping implemented (Monitor: `val_loss`, Patience: 3 epochs, Restore Best Weights).

## 7. Results
*   **Performance**: The models achieve high accuracy on the test set, demonstrating the viability of ResNet50 for this task.
*   **Visuals**: Detailed Accuracy and Loss curves for each model (Elbow, Hand, Shoulder) are available in the `plots/` directory.
*   **Note**: Exact numerical accuracy is calculated dynamically by `prediction_test.py` based on the current model weights (`weights/`). Please run `python prediction_test.py` to generate the precise confusion matrix and accuracy report for the current build.

## 8. Model Output & Decision Logic
*   **Return Format**: The system returns a categorical label (e.g., "Fractured" or "Normal") and the identified body part.
*   **Logic Flow**:
    1.  Image is resized to 224x224.
    2.  `ResNet50_BodyParts` model predicts the Body Part (e.g., "Hand").
    3.  Based on the part, the specific specialist model is loaded (e.g., `ResNet50_Hand_frac`).
    4.  The specialist model predicts the condition (Fractured vs. Normal).
*   **Confidence**: The class with the highest probability (`argmax`) is selected.
*   **Abstention**: The system does not currently abstain; it classifies every image provided.

## 9. System Architecture
*   **Frontend**:
    *   **Desktop**: Python CustomTkinter (GUI).
    *   **Web**: React.js (Demonstration Interface).
*   **Backend**: Django (Python) - Handles API requests and result storage.
*   **AI Inference**:
    *   **Desktop**: Runs locally using TensorFlow/Keras (`predictions.py`).
    *   **Web**: Currently utilizes a simulated analysis engine for demonstration purposes.
*   **Database**:
    *   `db.sqlite3` (Django Backend).
    *   `image_predictions.db` (Desktop Local Cache).
*   **Deployment**: Local execution.

## 10. API Behavior (Web)
*   **Endpoints**:
    *   `POST /api/analysis`: Saves a new analysis result (Input: FormData with image/metadata).
    *   `GET /api/analysis`: Retrieves past analysis results (Query: `image_name`).
*   **Format**: JSON responses.
*   **Error Handling**: Returns standard HTTP error codes (400 for bad request, 500 for server error).

## 11. User Workflow
### Desktop Application
1.  **Launch**: User opens `mainGUI.py`.
2.  **Upload**: User selects an X-ray image from the file dialog.
3.  **Process**: User clicks "Predict".
4.  **Inference**: System identifies the body part and checks for fractures.
5.  **Result**: Display shows "Type: [Part]" and "Result: [Fractured/Normal]".
6.  **Save**: User can save the result as a screenshot.

### Web Application
1.  **Access**: User visits `http://localhost:3000`.
2.  **Upload**: User drags & drops an image.
3.  **Analyze**: System simulates the analysis process (ProgressBar).
4.  **Report**: Detailed (simulated) medical report is displayed.

## 12. Limitations
*   **Body Part Scope**: Limited to Elbow, Hand, and Shoulder images only.
*   **Web Inference**: The web interface is a prototype and simulates AI results; it does not currently run the live TensorFlow model.
*   **Clinical Validation**: Not validated in a real-world clinical setting.
*   **Image Quality**: Highly dependent on standard radiographic views; poor quality images may yield incorrect results.

## 13. Future Scope
*   **Feature Extraction**: Implementation of Grad-CAM to visualize *where* the fracture is located.
*   **Expansion**: Adding support for Wrist, Ankle, and Knee.
*   **Real-time Web Integration**: Porting the TensorFlow model to the backend or TensorFlow.js for live web-based inference.

## 14. Setup & Execution
### Prerequisites
*   Python 3.9+
*   Node.js & npm

### Installation
1.  **Create Virtual Environment**:
    ```bash
    python -m venv .venv
    .\.venv\Scripts\activate
    ```
2.  **Install Python Dependencies**:
    ```bash
    pip install -r requirements_loose.txt
    ```
    *(Note: Use `requirements_loose.txt` for better compatibility)*
3.  **Install Web Dependencies**:
    ```bash
    cd bone-fracture-web
    npm install
    ```

### Execution
*   **Desktop App**:
    ```bash
    python mainGUI.py
    ```
*   **Web App**:
    1.  Start Backend: `python manage.py runserver`
    2.  Start Frontend: `cd bone-fracture-web && npm start`

## 15. Ethics, Safety & Compliance
*   **Research Use Only**: This tool is designed for academic research and educational demonstration.
*   **No Medical Advice**: It must not replace professional medical advice, diagnosis, or treatment.
*   **Data Privacy**: The dataset (MURA) is anonymized. Users should be cautious when uploading private patient data to any non-compliant system.

## 16. Final Validation
Another AI can understand the entire project behavior, boundaries, and results without asking a single clarification question.
