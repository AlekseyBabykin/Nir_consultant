FROM python:3.12-alpine

WORKDIR /app

COPY requirements.txt .

RUN apk add --no-cache postgresql-dev gcc python3-dev musl-dev libpq
RUN pip install -r requirements.txt

COPY . .

ENTRYPOINT ["python"]
CMD ["src/app.py"]
