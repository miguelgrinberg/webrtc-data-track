const dataTrack = new Twilio.Video.LocalDataTrack();

const setMessage = (message) => {
  document.getElementById('message').innerHTML = message;
};

const connect = async () => {
  // get a token
  let res = await fetch('/token', {method: 'POST'});
  let data = await res.json();

  // connect to the room
  let room;
  try {
    room = await Twilio.Video.connect(data.token, {tracks: [dataTrack]});
    setMessage('Connected!')
  }
  catch {
    setMessage('Connection Error')
    return;
  }

  // register to receive events from other participants already in the room
  room.participants.forEach(participantConnected);

  // register for new participants when they join the room
  room.on('participantConnected', participantConnected);
}

const participantConnected = (participant) => {
  participant.tracks.forEach(publication => {
    if (publication.track) {
      trackSubscribed(publication.track);
    }
  });
  participant.on('trackSubscribed', trackSubscribed);
};

const trackSubscribed = (track) => {
    if (track.kind === 'data') {
        track.on('message', data => receivePing(data));
    }
};

const sendPing = () => {
  dataTrack.send(document.getElementById('name').value)
}

const receivePing = (name) => {
  document.getElementById('pings').innerHTML += `<li>Ping from ${name}!</li>`
}

document.getElementById('ping').addEventListener('click', () => sendPing());
connect();
