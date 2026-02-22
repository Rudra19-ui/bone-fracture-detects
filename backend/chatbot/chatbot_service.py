class ChatbotService:
    @staticmethod
    def get_response(user_message):
        user_message = user_message.lower()
        
        # System usage guidance
        if "how" in user_message and "upload" in user_message:
            return "To upload an X-ray, navigate to the Dashboard 'Overview' tab and use the 'Upload X-Ray Image' section. You can drag and drop your image or click to select a file."
        
        if "generate" in user_message and "report" in user_message:
            return "Once an analysis is complete, a 'Download Report' button will appear in the results panel. Click it to generate a professional PDF medical report."
        
        if "how" in user_message and "use" in user_message:
            return "Simply upload an X-ray image in the Analysis tab, click 'Analyze Fracture', and wait for the AI to process it. You'll receive a confidence score and structural details."

        # Explaining analysis results
        if "confidence" in user_message:
            return "The confidence score reflects the AI model's certainty in its detection. A score above 75% indicates high confidence, while lower scores suggest the need for careful expert review."
        
        if "detected" in user_message:
            return "A 'Detected' status means the AI has identified patterns in the X-ray consistent with a bone fracture. Please consult a qualified radiologist for clinical confirmation."
        
        if "uncertain" in user_message:
            return "An 'Uncertain' status means the model found conflicting patterns. In such cases, the system recommends a manual review by a medical professional."

        # General questions
        if "what is" in user_message and "fracture" in user_message:
            return "A bone fracture is a medical condition where there is a partial or complete break in the continuity of the bone. Our system helps identify these breaks from X-ray imagery."
        
        if "accurate" in user_message:
            return "Our current model achieves approximately 92% accuracy on standard benchmark datasets like MURA. However, it is designed as a diagnostic aid, not a replacement for human expertise."

        # Navigation
        if "history" in user_message:
            return "You can view all your previous analysis results in the 'History' tab of the dashboard."
        
        if "settings" in user_message:
            return "The 'Settings' tab allows you to configure your profile and system preferences."

        # Default response
        return "I'm sorry, I didn't quite catch that. I can help with system navigation, explaining results, or general info about fracture detection. Try asking 'How to upload X-ray?' or 'What is a confidence score?'"
