import sys
import os
import traceback

# Ensure we are in the right directory for relative imports
# sys.path.append(os.getcwd()) 
# predictions.py uses relative paths for weights "weights/...", so we must be in the dir or fix paths.
# We will run this script from the project root.

from predictions import predict

def run_test():
    # Test image path
    # Using a known existing file from previous LS
    test_img = "test/Elbow/fractured/ElbowDan.jpeg"
    
    if not os.path.exists(test_img):
        print(f"Image not found at relative path: {test_img}")
        # Try finding any jpg in test folder
        for root, dirs, files in os.walk("test"):
            for file in files:
                if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                    test_img = os.path.join(root, file)
                    break
            if test_img != "test/Elbow/fractured/ElbowDan.jpeg": break
            
    print(f"Testing on {test_img}")
    if not os.path.exists(test_img):
        print("No test image found. Skipping inference test.")
        return

    try:
        # 1. Predict Part
        print("Predicting Part...")
        part = predict(test_img, "Parts")
        print(f"Part Prediction: {part}")
        
        # 2. Predict Fracture
        print(f"Predicting Fracture for {part}...")
        result = predict(test_img, part)
        print(f"Fracture Prediction Result: {result}")
        
        if isinstance(result, dict):
            print("Success: Dictionary returned.")
            print(f"Result: {result['result']}")
            print(f"Probability: {result['probability']}")
            print(f"Uncertain: {result['uncertain']}")
            print(f"Cam Path: {result['cam_path']}")
        else:
            print("Failure: Expected dictionary return for fracture prediction.")
            
    except Exception as e:
        print(f"Error during testing: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    run_test()
