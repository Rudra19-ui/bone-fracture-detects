import kagglehub
import os
import shutil

def integrate_dataset():
    print("Downloading dataset from Kaggle...")
    # Download latest version
    path = kagglehub.dataset_download("pkdarabi/bone-fracture-detection-computer-vision-project")
    print("Path to dataset files:", path)

    # Base directory of our project
    base_dir = r"C:\Users\rudra\OneDrive\Desktop\Bone-Fracture-Detection-master\Bone-Fracture-Detection-master"
    dataset_target = os.path.join(base_dir, "Dataset", "Kaggle_External")
    
    if not os.path.exists(dataset_target):
        os.makedirs(dataset_target, exist_ok=True)
        print(f"Created target directory: {dataset_target}")

    # Logic to move/link files could go here if needed, 
    # but for now we'll just ensure the path is accessible.
    print(f"Dataset is now available at: {path}")
    
    # Test loading logic
    from training_fracture import load_kaggle_data
    for part in ["Elbow", "Hand", "Shoulder"]:
        count = len(load_kaggle_data(part))
        print(f"Verified: {count} external {part} images ready for training.")

if __name__ == "__main__":
    integrate_dataset()
