# Getting Started

## What is Orbis2?
**Orbis2** is a tool for NLP annotation evaluation. It is designed to evaluate the quality of annotations in NLP tasks. Orbis2 is a web-based tool that provides a user-friendly interface to evaluate the quality of annotations. It supports multiple evaluation types and metrics. Orbis2 is designed for various audiences, including researchers, developers, and data scientists. It supports LabelStudio JSON files, Doccano JSONL files, and general JSON files. Orbis2 is developed by the University of Applied Sciences of the Grisons.

![Orbis2](orbis-screenshot.png)

## Orbis2 evaluation workflow
To complete an evaluation, follow these steps:
1. Install Orbis2
2. Run Orbis2
3. Import a new corpus (Gold Standard). You can use a LabelStudio JSON file, a Doccano JSONL file, or a general JSON file.
4. Import or create a new run with LLMs. You can use a LabelStudio JSON file, a Doccano JSONL file, or a general JSON file.
5. Evaluate the run with the Gold Standard by choosing the run on the navigation bar.
6. Drill down into the run to get detailed information about the evaluation.

## Quickstart
To get started with Orbis2, follow these steps:
1. Install Orbis2 with Docker
   ```bash
    docker run --net host --name orbis2-frontend -p 8090:8090 \
   -e PGDATA=/var/lib/postgresql/data/pgdata \
   -v orbis-data:/var/lib/postgresql/data \
    ghcr.io/orbis-eval/orbis2-frontend:latest
    ```
2. Open your browser and navigate to `http://localhost:8090`
3. Import a new corpus (Use the example below to start)
4. Import or create a new run
5. Conduct evaluations

## Example of a Corpus
Filename: corpus.jsonl
```jsonl
{"id":1,"text":"The quick brown fox jumps over the lazy dog.","label":[[16,19,"ANIMAL"],[40,43,"ANIMAL"]]}
{"id":2,"text":"The elephant in the room is a big problem.","label":[[4,12,"ANIMAL"],[20,24,"PLACE"]]}
```

## Architecture

| Module     | Technology | Description |
|------------|------------| ----------- |
| [orbis2-backend](https://github.com/orbis-eval/orbis2-backend) | Python, FastAPI and SQLAlchemy | Perform NLP evaluation via REST APIs |
| [orbis2-frontend](https://github.com/orbis-eval/orbis2-frontend)   | Nuxt Web App with Typescript and Pinia | Perform NLP evaluation via Web App |

## Contact
If you get stuck, check the [FAQs](../faq/).
For help and feedback, feel free to contact via [GitHub Issues](https://github.com/orbis-eval/orbis2-frontend/issues)