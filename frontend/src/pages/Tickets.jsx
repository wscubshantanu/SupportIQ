{
    tickets.map((ticket) => (

        <div key={ticket.id}>

            <h3>

                {ticket.title}

            </h3>


            <p>

                Category:
                {ticket.category}

            </p>


            <p>

                Priority:
                {ticket.priority}

            </p>


            <p>

                Sentiment:
                {ticket.sentiment}

            </p>


            <p>

                Status:
                {ticket.status}

            </p>

        </div>

    ))
}
