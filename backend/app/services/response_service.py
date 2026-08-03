def generate_response(category):

    # Predefined response templates
    responses = {

        "Billing":
        "Our billing team will review your payment issue.",

        "Technical":
        "Our technical team is investigating your issue.",

        "Account":
        "Please verify your account details.",

        "Subscription":
        "Our subscription team will assist you shortly."

    }


    # Return matching response
    return responses.get(

        category,

        "Our support team will review your request."

    )