import time

def process_task(operation, input_data):
    """
    Mock AI operations
    """
    input_str = str(input_data) if input_data else ""
    
    if operation == "Text Summary":
        return _text_summary(input_str)
    elif operation == "Sentiment Analysis":
        return _sentiment_analysis(input_str)
    elif operation == "Keyword Extraction":
        return _keyword_extraction(input_str)
    else:
        raise ValueError(f"Unsupported operation: {operation}")

def _text_summary(text):
    # Return first 2 sentences
    if not text:
        return "No text provided to summarize."
    sentences = text.replace('!', '.').replace('?', '.').split('.')
    summary = '. '.join([s.strip() for s in sentences if s.strip()][:2])
    if summary:
        return summary + "."
    return text

def _sentiment_analysis(text):
    text_lower = text.lower()
    positive_words = ['good', 'great', 'awesome', 'excellent', 'happy', 'love', 'positive']
    negative_words = ['bad', 'terrible', 'awful', 'sad', 'hate', 'negative', 'poor']
    
    pos_count = sum(1 for word in positive_words if word in text_lower)
    neg_count = sum(1 for word in negative_words if word in text_lower)
    
    if pos_count > neg_count:
        return "Positive"
    elif neg_count > pos_count:
        return "Negative"
    else:
        return "Neutral"

def _keyword_extraction(text):
    # Simple split by space and filter out small words
    if not text:
        return []
    words = text.split()
    keywords = list(set([w.strip(',.!?') for w in words if len(w) > 4]))
    return keywords[:5] # Return top 5
