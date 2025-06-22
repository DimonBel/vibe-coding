FROM python:3.8

RUN useradd --create-home userapi
WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt
COPY ./ .
RUN chown -R userapi:userapi ./
USER userapi

EXPOSE 5000
CMD gunicorn --bind 0.0.0.0:5000 app:app