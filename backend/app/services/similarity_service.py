from sklearn.feature_extraction.text import TfidfVectorizer

from sklearn.metrics.pairwise import cosine_similarity


def find_similar_tickets(
    new_ticket,
    historical_tickets
):

    # Combine new ticket with old tickets
    texts = [
        new_ticket
    ]

    texts.extend(
        historical_tickets
    )


    # Convert text into numbers
    vectorizer = TfidfVectorizer()

    vectors = vectorizer.fit_transform(
        texts
    )


    # Calculate similarity
    similarity_scores = cosine_similarity(
        vectors[0:1],
        vectors[1:]
    )


    return similarity_scores[0]