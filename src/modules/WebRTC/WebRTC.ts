// @ts-nocheck
import AgoraRTM from "agora-rtm-sdk";
import type { RtmClient, RtmChannel, RtmMessage } from 'agora-rtm-sdk'
import { EventEmitter } from "modules/EventEmitter/EventEmitter";

type PossibleEvent = 'joined' | 'left' | 'message' | 'connected'
export const connectionEmitter = new EventEmitter<PossibleEvent>()

export const avatarEE = new EventEmitter<string>()

export type SupportedMessageType = 'main-scene:change-character'
  | 'main-scene:player-is-ready'
  | 'main-scene:change-arena'
  | 'main-scene:arena-is-selected'
type Message = Record<string, unknown> & { type: SupportedMessageType }

// TODO move to .env variable
const APP_ID = "92e993a84f45433fac4c116aedc52b0a"
const token = undefined;
const uid = String(Math.floor(Math.random() * 10000))

const configuration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
    }
  ]
}

class WebRTCConnection {
  appId: string;
  client: RtmClient | null;
  channel: RtmChannel | null;
  peerConnection: RTCPeerConnection | null;
  joinedMemberId: string | null;
  isHost: boolean;
  connected: boolean;

  constructor({ appId }: { appId: string }) {
    this.appId = appId
    this.peerConnection = null
    this.client = null
    this.channel = null
    this.joinedMemberId = null
    this.isHost = false
    this.connected = false

    this.createPeerConnection = this.createPeerConnection.bind(this)
    this.init = this.init.bind(this)
    this.createOffer = this.createOffer.bind(this)
    this.createAnswer = this.createAnswer.bind(this)
    this.handleUserJoined = this.handleUserJoined.bind(this)
    this.handleMemberLeft = this.handleMemberLeft.bind(this)
    this.addAnswer = this.addAnswer.bind(this)
    this.handleMessageFromPeer = this.handleMessageFromPeer.bind(this)
  }

  async createPeerConnection() {
    this.peerConnection = new RTCPeerConnection(configuration)
  }

  async init() {
    this.client = await AgoraRTM.createInstance(APP_ID)
    await this.client.login({ uid, token })
    // TODO add roomId support from window.location
    this.channel = this.client.createChannel('main')
    await this.channel.join()
    this.channel.on('MemberJoined', this.handleUserJoined)
    this.channel.on('MemberLeft', this.handleMemberLeft)
    this.client.on('MessageFromPeer', this.handleMessageFromPeer)

    this.createOffer(uid)
  }

  async createOffer(memberId: string) {
    await this.createPeerConnection()
    const offer = await this.peerConnection?.createOffer()
    await this.peerConnection?.setLocalDescription(offer)
    this.client?.sendMessageToPeer({ text: JSON.stringify({ type: 'offer', offer }) }, memberId)
  }

  async createAnswer(memberId: string, offer: RTCSessionDescriptionInit) {
    this.joinedMemberId = memberId
    await this.createPeerConnection()
    await this.peerConnection?.setRemoteDescription(offer)
    const answer = await this.peerConnection?.createAnswer()
    await this.peerConnection?.setLocalDescription(answer)
    this.client?.sendMessageToPeer(
      { text: JSON.stringify({ type: 'answer', answer }) },
      memberId,
    )
      .then(({ hasPeerReceived }: { hasPeerReceived: boolean }) => {
        if (hasPeerReceived) {
          this.connected = true
          connectionEmitter.emit('connected', { memberId })
        }
      })
  }

  async handleUserJoined(memberId: string) {
    this.createOffer(memberId).then(() => {
      this.joinedMemberId = memberId
      this.isHost = true
      this.connected = true
      connectionEmitter.emit('joined', { memberId })
      connectionEmitter.emit('connected', { memberId })
    })
  }

  async handleMemberLeft(memberId: string) {
    this.joinedMemberId = null
    connectionEmitter.emit('left', { memberId })
  }

  async leaveChannel() {
    await this.channel?.leave()
    await this.client?.logout()
  }

  async addAnswer(answer: RTCSessionDescriptionInit) {
    if (!this.peerConnection?.currentRemoteDescription) {
      this.peerConnection?.setRemoteDescription(answer)
    }
  }

  handleMessageFromPeer(
    message: RtmMessage,
    memberId: string,
  ) {
    const res = message.text ? JSON.parse(message.text) : undefined
    if (res.type === 'offer') {
      this.createAnswer(memberId, res.offer)
    }
    if (res.type === 'answer') {
      this.addAnswer(res.answer)
    }
    if (res.type === 'message') {
      
      connectionEmitter.emit('message', { message, memberId })

      // console.log(JSON.parse(message.text).message.type)

      switch (JSON.parse(message.text).message.type) {
        case 'moveRight':
          avatarEE.emit('moveRight')
        break;

        case 'moveLeft':
          avatarEE.emit('moveLeft')
        break;

        case 'jumping':
          avatarEE.emit('jumping')
        break;

        case 'moveRightEnd':
          avatarEE.emit('moveRightEnd')
        break;

        case 'moveLeftEnd':
          avatarEE.emit('moveLeftEnd')
        break;

        case 'jumpingEnd':
          avatarEE.emit('jumpingEnd')
        break;
      
        default:
          break;
      }
    }
  }

  get getChannel(): RtmChannel {
    return this.channel!
  }

  sendMessage(
    message: {
      type: string,
      message: Message,
    }
  ) {
    if (this.joinedMemberId) {
      this.client?.sendMessageToPeer(
        { text: JSON.stringify(message) },
        this.joinedMemberId,
      )
    }
  }
}

export const rtcConnection = new WebRTCConnection({ appId: APP_ID })

window.addEventListener('beforeunload', () => {
  rtcConnection.leaveChannel()
})