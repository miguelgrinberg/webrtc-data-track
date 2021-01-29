import os
import time
from dotenv import load_dotenv
from flask import Flask, render_template
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VideoGrant

load_dotenv()
twilio_account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
twilio_api_key_sid = os.environ.get('TWILIO_API_KEY_SID')
twilio_api_key_secret = os.environ.get('TWILIO_API_KEY_SECRET')

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/token', methods=['POST'])
def token():
    username = f'user-{time.time()}'

    # generate access token
    token = AccessToken(twilio_account_sid, twilio_api_key_sid,
                        twilio_api_key_secret, identity=username,
                        ttl=3600)

    # add grants to token
    token.add_grant(VideoGrant(room='ping-room'))

    # return token
    return {'token': token.to_jwt().decode()}


if __name__ == '__main__':
    app.run()
