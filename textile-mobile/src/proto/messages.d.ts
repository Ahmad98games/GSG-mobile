import * as $protobuf from "protobufjs";
/** Namespace omnora. */
export namespace omnora {

    /** Properties of a Packet. */
    interface IPacket {

        /** Packet packetId */
        packetId?: (string|null);

        /** Packet nodeId */
        nodeId?: (string|null);

        /** Packet timestamp */
        timestamp?: (number|Long|null);

        /** Packet scan */
        scan?: (omnora.IScanEvent|null);

        /** Packet heartbeat */
        heartbeat?: (omnora.IHeartbeatEvent|null);

        /** Packet sos */
        sos?: (omnora.ISOSEvent|null);

        /** Packet error */
        error?: (omnora.IErrorEvent|null);

        /** Packet telemetry */
        telemetry?: (omnora.ITelemetryEvent|null);

        /** Packet khata */
        khata?: (omnora.IKhataEntry|null);

        /** Packet stock */
        stock?: (omnora.IStockDelta|null);

        /** Packet message */
        message?: (omnora.ITacticalMessage|null);

        /** Packet ack */
        ack?: (omnora.IHubAck|null);

        /** Packet typing */
        typing?: (omnora.ITypingEvent|null);

        /** Packet fetchPending */
        fetchPending?: (omnora.IFetchPendingMessagesRequest|null);

        /** Packet profileManifest */
        profileManifest?: (omnora.IProfileManifest|null);

        /** Packet nsp */
        nsp?: (omnora.INspEnvelope|null);
    }

    /** GLOBAL PACKET ENVELOPE */
    class Packet implements IPacket {

        /**
         * Constructs a new Packet.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IPacket);

        /** Packet packetId. */
        public packetId: string;

        /** Packet nodeId. */
        public nodeId: string;

        /** Packet timestamp. */
        public timestamp: (number|Long);

        /** Packet scan. */
        public scan?: (omnora.IScanEvent|null);

        /** Packet heartbeat. */
        public heartbeat?: (omnora.IHeartbeatEvent|null);

        /** Packet sos. */
        public sos?: (omnora.ISOSEvent|null);

        /** Packet error. */
        public error?: (omnora.IErrorEvent|null);

        /** Packet telemetry. */
        public telemetry?: (omnora.ITelemetryEvent|null);

        /** Packet khata. */
        public khata?: (omnora.IKhataEntry|null);

        /** Packet stock. */
        public stock?: (omnora.IStockDelta|null);

        /** Packet message. */
        public message?: (omnora.ITacticalMessage|null);

        /** Packet ack. */
        public ack?: (omnora.IHubAck|null);

        /** Packet typing. */
        public typing?: (omnora.ITypingEvent|null);

        /** Packet fetchPending. */
        public fetchPending?: (omnora.IFetchPendingMessagesRequest|null);

        /** Packet profileManifest. */
        public profileManifest?: (omnora.IProfileManifest|null);

        /** Packet nsp. */
        public nsp?: (omnora.INspEnvelope|null);

        /** Packet event. */
        public event?: ("scan"|"heartbeat"|"sos"|"error"|"telemetry"|"khata"|"stock"|"message"|"ack"|"typing"|"fetchPending"|"profileManifest"|"nsp");

        /**
         * Creates a new Packet instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Packet instance
         */
        public static create(properties?: omnora.IPacket): omnora.Packet;

        /**
         * Encodes the specified Packet message. Does not implicitly {@link omnora.Packet.verify|verify} messages.
         * @param message Packet message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IPacket, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Packet message, length delimited. Does not implicitly {@link omnora.Packet.verify|verify} messages.
         * @param message Packet message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IPacket, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Packet message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Packet
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.Packet;

        /**
         * Decodes a Packet message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Packet
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.Packet;

        /**
         * Verifies a Packet message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Packet message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Packet
         */
        public static fromObject(object: { [k: string]: any }): omnora.Packet;

        /**
         * Creates a plain object from a Packet message. Also converts values to other types if specified.
         * @param message Packet
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.Packet, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Packet to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SentinelBreachEvent. */
    interface ISentinelBreachEvent {

        /** SentinelBreachEvent nodeId */
        nodeId?: (string|null);

        /** SentinelBreachEvent zoneId */
        zoneId?: (string|null);

        /** SentinelBreachEvent detectedClass */
        detectedClass?: (string|null);

        /** SentinelBreachEvent confidence */
        confidence?: (number|null);

        /** SentinelBreachEvent timestamp */
        timestamp?: (number|Long|null);

        /** SentinelBreachEvent jpegFrame */
        jpegFrame?: (Uint8Array|null);
    }

    /** Represents a SentinelBreachEvent. */
    class SentinelBreachEvent implements ISentinelBreachEvent {

        /**
         * Constructs a new SentinelBreachEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.ISentinelBreachEvent);

        /** SentinelBreachEvent nodeId. */
        public nodeId: string;

        /** SentinelBreachEvent zoneId. */
        public zoneId: string;

        /** SentinelBreachEvent detectedClass. */
        public detectedClass: string;

        /** SentinelBreachEvent confidence. */
        public confidence: number;

        /** SentinelBreachEvent timestamp. */
        public timestamp: (number|Long);

        /** SentinelBreachEvent jpegFrame. */
        public jpegFrame: Uint8Array;

        /**
         * Creates a new SentinelBreachEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SentinelBreachEvent instance
         */
        public static create(properties?: omnora.ISentinelBreachEvent): omnora.SentinelBreachEvent;

        /**
         * Encodes the specified SentinelBreachEvent message. Does not implicitly {@link omnora.SentinelBreachEvent.verify|verify} messages.
         * @param message SentinelBreachEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.ISentinelBreachEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SentinelBreachEvent message, length delimited. Does not implicitly {@link omnora.SentinelBreachEvent.verify|verify} messages.
         * @param message SentinelBreachEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.ISentinelBreachEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SentinelBreachEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SentinelBreachEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.SentinelBreachEvent;

        /**
         * Decodes a SentinelBreachEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SentinelBreachEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.SentinelBreachEvent;

        /**
         * Verifies a SentinelBreachEvent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SentinelBreachEvent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SentinelBreachEvent
         */
        public static fromObject(object: { [k: string]: any }): omnora.SentinelBreachEvent;

        /**
         * Creates a plain object from a SentinelBreachEvent message. Also converts values to other types if specified.
         * @param message SentinelBreachEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.SentinelBreachEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SentinelBreachEvent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SystemLockCommand. */
    interface ISystemLockCommand {

        /** SystemLockCommand issuedByNodeId */
        issuedByNodeId?: (string|null);

        /** SystemLockCommand reason */
        reason?: (string|null);

        /** SystemLockCommand timestamp */
        timestamp?: (number|Long|null);

        /** SystemLockCommand lock */
        lock?: (boolean|null);
    }

    /** Represents a SystemLockCommand. */
    class SystemLockCommand implements ISystemLockCommand {

        /**
         * Constructs a new SystemLockCommand.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.ISystemLockCommand);

        /** SystemLockCommand issuedByNodeId. */
        public issuedByNodeId: string;

        /** SystemLockCommand reason. */
        public reason: string;

        /** SystemLockCommand timestamp. */
        public timestamp: (number|Long);

        /** SystemLockCommand lock. */
        public lock: boolean;

        /**
         * Creates a new SystemLockCommand instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SystemLockCommand instance
         */
        public static create(properties?: omnora.ISystemLockCommand): omnora.SystemLockCommand;

        /**
         * Encodes the specified SystemLockCommand message. Does not implicitly {@link omnora.SystemLockCommand.verify|verify} messages.
         * @param message SystemLockCommand message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.ISystemLockCommand, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SystemLockCommand message, length delimited. Does not implicitly {@link omnora.SystemLockCommand.verify|verify} messages.
         * @param message SystemLockCommand message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.ISystemLockCommand, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SystemLockCommand message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SystemLockCommand
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.SystemLockCommand;

        /**
         * Decodes a SystemLockCommand message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SystemLockCommand
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.SystemLockCommand;

        /**
         * Verifies a SystemLockCommand message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SystemLockCommand message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SystemLockCommand
         */
        public static fromObject(object: { [k: string]: any }): omnora.SystemLockCommand;

        /**
         * Creates a plain object from a SystemLockCommand message. Also converts values to other types if specified.
         * @param message SystemLockCommand
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.SystemLockCommand, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SystemLockCommand to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GuardianAuthRequest. */
    interface IGuardianAuthRequest {

        /** GuardianAuthRequest requestId */
        requestId?: (string|null);

        /** GuardianAuthRequest hubAction */
        hubAction?: (string|null);

        /** GuardianAuthRequest expiresAt */
        expiresAt?: (number|Long|null);

        /** GuardianAuthRequest timestamp */
        timestamp?: (number|Long|null);
    }

    /** Represents a GuardianAuthRequest. */
    class GuardianAuthRequest implements IGuardianAuthRequest {

        /**
         * Constructs a new GuardianAuthRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IGuardianAuthRequest);

        /** GuardianAuthRequest requestId. */
        public requestId: string;

        /** GuardianAuthRequest hubAction. */
        public hubAction: string;

        /** GuardianAuthRequest expiresAt. */
        public expiresAt: (number|Long);

        /** GuardianAuthRequest timestamp. */
        public timestamp: (number|Long);

        /**
         * Creates a new GuardianAuthRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GuardianAuthRequest instance
         */
        public static create(properties?: omnora.IGuardianAuthRequest): omnora.GuardianAuthRequest;

        /**
         * Encodes the specified GuardianAuthRequest message. Does not implicitly {@link omnora.GuardianAuthRequest.verify|verify} messages.
         * @param message GuardianAuthRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IGuardianAuthRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GuardianAuthRequest message, length delimited. Does not implicitly {@link omnora.GuardianAuthRequest.verify|verify} messages.
         * @param message GuardianAuthRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IGuardianAuthRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GuardianAuthRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GuardianAuthRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.GuardianAuthRequest;

        /**
         * Decodes a GuardianAuthRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GuardianAuthRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.GuardianAuthRequest;

        /**
         * Verifies a GuardianAuthRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GuardianAuthRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GuardianAuthRequest
         */
        public static fromObject(object: { [k: string]: any }): omnora.GuardianAuthRequest;

        /**
         * Creates a plain object from a GuardianAuthRequest message. Also converts values to other types if specified.
         * @param message GuardianAuthRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.GuardianAuthRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GuardianAuthRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GuardianAuthResponse. */
    interface IGuardianAuthResponse {

        /** GuardianAuthResponse requestId */
        requestId?: (string|null);

        /** GuardianAuthResponse approved */
        approved?: (boolean|null);

        /** GuardianAuthResponse nodeId */
        nodeId?: (string|null);

        /** GuardianAuthResponse timestamp */
        timestamp?: (number|Long|null);

        /** GuardianAuthResponse authToken */
        authToken?: (string|null);
    }

    /** Represents a GuardianAuthResponse. */
    class GuardianAuthResponse implements IGuardianAuthResponse {

        /**
         * Constructs a new GuardianAuthResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IGuardianAuthResponse);

        /** GuardianAuthResponse requestId. */
        public requestId: string;

        /** GuardianAuthResponse approved. */
        public approved: boolean;

        /** GuardianAuthResponse nodeId. */
        public nodeId: string;

        /** GuardianAuthResponse timestamp. */
        public timestamp: (number|Long);

        /** GuardianAuthResponse authToken. */
        public authToken: string;

        /**
         * Creates a new GuardianAuthResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GuardianAuthResponse instance
         */
        public static create(properties?: omnora.IGuardianAuthResponse): omnora.GuardianAuthResponse;

        /**
         * Encodes the specified GuardianAuthResponse message. Does not implicitly {@link omnora.GuardianAuthResponse.verify|verify} messages.
         * @param message GuardianAuthResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IGuardianAuthResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GuardianAuthResponse message, length delimited. Does not implicitly {@link omnora.GuardianAuthResponse.verify|verify} messages.
         * @param message GuardianAuthResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IGuardianAuthResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GuardianAuthResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GuardianAuthResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.GuardianAuthResponse;

        /**
         * Decodes a GuardianAuthResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GuardianAuthResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.GuardianAuthResponse;

        /**
         * Verifies a GuardianAuthResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GuardianAuthResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GuardianAuthResponse
         */
        public static fromObject(object: { [k: string]: any }): omnora.GuardianAuthResponse;

        /**
         * Creates a plain object from a GuardianAuthResponse message. Also converts values to other types if specified.
         * @param message GuardianAuthResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.GuardianAuthResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GuardianAuthResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a HeartbeatAlertEvent. */
    interface IHeartbeatAlertEvent {

        /** HeartbeatAlertEvent nodeId */
        nodeId?: (string|null);

        /** HeartbeatAlertEvent alertType */
        alertType?: (string|null);

        /** HeartbeatAlertEvent timestamp */
        timestamp?: (number|Long|null);
    }

    /** Represents a HeartbeatAlertEvent. */
    class HeartbeatAlertEvent implements IHeartbeatAlertEvent {

        /**
         * Constructs a new HeartbeatAlertEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IHeartbeatAlertEvent);

        /** HeartbeatAlertEvent nodeId. */
        public nodeId: string;

        /** HeartbeatAlertEvent alertType. */
        public alertType: string;

        /** HeartbeatAlertEvent timestamp. */
        public timestamp: (number|Long);

        /**
         * Creates a new HeartbeatAlertEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HeartbeatAlertEvent instance
         */
        public static create(properties?: omnora.IHeartbeatAlertEvent): omnora.HeartbeatAlertEvent;

        /**
         * Encodes the specified HeartbeatAlertEvent message. Does not implicitly {@link omnora.HeartbeatAlertEvent.verify|verify} messages.
         * @param message HeartbeatAlertEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IHeartbeatAlertEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified HeartbeatAlertEvent message, length delimited. Does not implicitly {@link omnora.HeartbeatAlertEvent.verify|verify} messages.
         * @param message HeartbeatAlertEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IHeartbeatAlertEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a HeartbeatAlertEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HeartbeatAlertEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.HeartbeatAlertEvent;

        /**
         * Decodes a HeartbeatAlertEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HeartbeatAlertEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.HeartbeatAlertEvent;

        /**
         * Verifies a HeartbeatAlertEvent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a HeartbeatAlertEvent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HeartbeatAlertEvent
         */
        public static fromObject(object: { [k: string]: any }): omnora.HeartbeatAlertEvent;

        /**
         * Creates a plain object from a HeartbeatAlertEvent message. Also converts values to other types if specified.
         * @param message HeartbeatAlertEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.HeartbeatAlertEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this HeartbeatAlertEvent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a VoiceCommandResult. */
    interface IVoiceCommandResult {

        /** VoiceCommandResult commandText */
        commandText?: (string|null);

        /** VoiceCommandResult mappedAction */
        mappedAction?: (string|null);

        /** VoiceCommandResult entityName */
        entityName?: (string|null);

        /** VoiceCommandResult amountPkr */
        amountPkr?: (string|null);

        /** VoiceCommandResult confidenceOk */
        confidenceOk?: (boolean|null);

        /** VoiceCommandResult timestamp */
        timestamp?: (number|Long|null);
    }

    /** Represents a VoiceCommandResult. */
    class VoiceCommandResult implements IVoiceCommandResult {

        /**
         * Constructs a new VoiceCommandResult.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IVoiceCommandResult);

        /** VoiceCommandResult commandText. */
        public commandText: string;

        /** VoiceCommandResult mappedAction. */
        public mappedAction: string;

        /** VoiceCommandResult entityName. */
        public entityName: string;

        /** VoiceCommandResult amountPkr. */
        public amountPkr: string;

        /** VoiceCommandResult confidenceOk. */
        public confidenceOk: boolean;

        /** VoiceCommandResult timestamp. */
        public timestamp: (number|Long);

        /**
         * Creates a new VoiceCommandResult instance using the specified properties.
         * @param [properties] Properties to set
         * @returns VoiceCommandResult instance
         */
        public static create(properties?: omnora.IVoiceCommandResult): omnora.VoiceCommandResult;

        /**
         * Encodes the specified VoiceCommandResult message. Does not implicitly {@link omnora.VoiceCommandResult.verify|verify} messages.
         * @param message VoiceCommandResult message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IVoiceCommandResult, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified VoiceCommandResult message, length delimited. Does not implicitly {@link omnora.VoiceCommandResult.verify|verify} messages.
         * @param message VoiceCommandResult message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IVoiceCommandResult, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a VoiceCommandResult message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns VoiceCommandResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.VoiceCommandResult;

        /**
         * Decodes a VoiceCommandResult message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns VoiceCommandResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.VoiceCommandResult;

        /**
         * Verifies a VoiceCommandResult message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a VoiceCommandResult message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns VoiceCommandResult
         */
        public static fromObject(object: { [k: string]: any }): omnora.VoiceCommandResult;

        /**
         * Creates a plain object from a VoiceCommandResult message. Also converts values to other types if specified.
         * @param message VoiceCommandResult
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.VoiceCommandResult, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this VoiceCommandResult to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a NspEnvelope. */
    interface INspEnvelope {

        /** NspEnvelope sentinelBreach */
        sentinelBreach?: (omnora.ISentinelBreachEvent|null);

        /** NspEnvelope systemLock */
        systemLock?: (omnora.ISystemLockCommand|null);

        /** NspEnvelope guardianRequest */
        guardianRequest?: (omnora.IGuardianAuthRequest|null);

        /** NspEnvelope guardianResponse */
        guardianResponse?: (omnora.IGuardianAuthResponse|null);

        /** NspEnvelope heartbeatAlert */
        heartbeatAlert?: (omnora.IHeartbeatAlertEvent|null);

        /** NspEnvelope voiceCommandResult */
        voiceCommandResult?: (omnora.IVoiceCommandResult|null);

        /** NspEnvelope stockLookupReq */
        stockLookupReq?: (omnora.IStockLookupRequest|null);

        /** NspEnvelope stockLookupRes */
        stockLookupRes?: (omnora.IStockLookupResponse|null);

        /** NspEnvelope readReceipt */
        readReceipt?: (omnora.IReadReceipt|null);

        /** NspEnvelope presenceUpdate */
        presenceUpdate?: (omnora.IPresenceUpdate|null);

        /** NspEnvelope ledgerSummaryReq */
        ledgerSummaryReq?: (omnora.ILedgerSummaryRequest|null);

        /** NspEnvelope ledgerSummaryRes */
        ledgerSummaryRes?: (omnora.ILedgerSummaryResponse|null);

        /** NspEnvelope partyBalanceReq */
        partyBalanceReq?: (omnora.IPartyBalanceRequest|null);

        /** NspEnvelope partyBalanceRes */
        partyBalanceRes?: (omnora.IPartyBalanceResponse|null);

        /** NspEnvelope invoiceSummaryReq */
        invoiceSummaryReq?: (omnora.IInvoiceSummaryRequest|null);

        /** NspEnvelope invoiceSummaryRes */
        invoiceSummaryRes?: (omnora.IInvoiceSummaryResponse|null);

        /** NspEnvelope paySlipReq */
        paySlipReq?: (omnora.IPaySlipRequest|null);

        /** NspEnvelope paySlipRes */
        paySlipRes?: (omnora.IPaySlipResponse|null);

        /** NspEnvelope branchListReq */
        branchListReq?: (omnora.IBranchListRequest|null);

        /** NspEnvelope branchListRes */
        branchListRes?: (omnora.IBranchListResponse|null);

        /** NspEnvelope switchBranchReq */
        switchBranchReq?: (omnora.ISwitchBranchRequest|null);

        /** NspEnvelope switchBranchRes */
        switchBranchRes?: (omnora.ISwitchBranchResponse|null);

        /** NspEnvelope detectionHistoryReq */
        detectionHistoryReq?: (omnora.IDetectionHistoryRequest|null);

        /** NspEnvelope detectionHistoryRes */
        detectionHistoryRes?: (omnora.IDetectionHistoryResponse|null);

        /** NspEnvelope cameraStatusReq */
        cameraStatusReq?: (omnora.ICameraStatusRequest|null);

        /** NspEnvelope cameraStatusRes */
        cameraStatusRes?: (omnora.ICameraStatusResponse|null);
    }

    /** Represents a NspEnvelope. */
    class NspEnvelope implements INspEnvelope {

        /**
         * Constructs a new NspEnvelope.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.INspEnvelope);

        /** NspEnvelope sentinelBreach. */
        public sentinelBreach?: (omnora.ISentinelBreachEvent|null);

        /** NspEnvelope systemLock. */
        public systemLock?: (omnora.ISystemLockCommand|null);

        /** NspEnvelope guardianRequest. */
        public guardianRequest?: (omnora.IGuardianAuthRequest|null);

        /** NspEnvelope guardianResponse. */
        public guardianResponse?: (omnora.IGuardianAuthResponse|null);

        /** NspEnvelope heartbeatAlert. */
        public heartbeatAlert?: (omnora.IHeartbeatAlertEvent|null);

        /** NspEnvelope voiceCommandResult. */
        public voiceCommandResult?: (omnora.IVoiceCommandResult|null);

        /** NspEnvelope stockLookupReq. */
        public stockLookupReq?: (omnora.IStockLookupRequest|null);

        /** NspEnvelope stockLookupRes. */
        public stockLookupRes?: (omnora.IStockLookupResponse|null);

        /** NspEnvelope readReceipt. */
        public readReceipt?: (omnora.IReadReceipt|null);

        /** NspEnvelope presenceUpdate. */
        public presenceUpdate?: (omnora.IPresenceUpdate|null);

        /** NspEnvelope ledgerSummaryReq. */
        public ledgerSummaryReq?: (omnora.ILedgerSummaryRequest|null);

        /** NspEnvelope ledgerSummaryRes. */
        public ledgerSummaryRes?: (omnora.ILedgerSummaryResponse|null);

        /** NspEnvelope partyBalanceReq. */
        public partyBalanceReq?: (omnora.IPartyBalanceRequest|null);

        /** NspEnvelope partyBalanceRes. */
        public partyBalanceRes?: (omnora.IPartyBalanceResponse|null);

        /** NspEnvelope invoiceSummaryReq. */
        public invoiceSummaryReq?: (omnora.IInvoiceSummaryRequest|null);

        /** NspEnvelope invoiceSummaryRes. */
        public invoiceSummaryRes?: (omnora.IInvoiceSummaryResponse|null);

        /** NspEnvelope paySlipReq. */
        public paySlipReq?: (omnora.IPaySlipRequest|null);

        /** NspEnvelope paySlipRes. */
        public paySlipRes?: (omnora.IPaySlipResponse|null);

        /** NspEnvelope branchListReq. */
        public branchListReq?: (omnora.IBranchListRequest|null);

        /** NspEnvelope branchListRes. */
        public branchListRes?: (omnora.IBranchListResponse|null);

        /** NspEnvelope switchBranchReq. */
        public switchBranchReq?: (omnora.ISwitchBranchRequest|null);

        /** NspEnvelope switchBranchRes. */
        public switchBranchRes?: (omnora.ISwitchBranchResponse|null);

        /** NspEnvelope detectionHistoryReq. */
        public detectionHistoryReq?: (omnora.IDetectionHistoryRequest|null);

        /** NspEnvelope detectionHistoryRes. */
        public detectionHistoryRes?: (omnora.IDetectionHistoryResponse|null);

        /** NspEnvelope cameraStatusReq. */
        public cameraStatusReq?: (omnora.ICameraStatusRequest|null);

        /** NspEnvelope cameraStatusRes. */
        public cameraStatusRes?: (omnora.ICameraStatusResponse|null);

        /** NspEnvelope payload. */
        public payload?: ("sentinelBreach"|"systemLock"|"guardianRequest"|"guardianResponse"|"heartbeatAlert"|"voiceCommandResult"|"stockLookupReq"|"stockLookupRes"|"readReceipt"|"presenceUpdate"|"ledgerSummaryReq"|"ledgerSummaryRes"|"partyBalanceReq"|"partyBalanceRes"|"invoiceSummaryReq"|"invoiceSummaryRes"|"paySlipReq"|"paySlipRes"|"branchListReq"|"branchListRes"|"switchBranchReq"|"switchBranchRes"|"detectionHistoryReq"|"detectionHistoryRes"|"cameraStatusReq"|"cameraStatusRes");

        /**
         * Creates a new NspEnvelope instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NspEnvelope instance
         */
        public static create(properties?: omnora.INspEnvelope): omnora.NspEnvelope;

        /**
         * Encodes the specified NspEnvelope message. Does not implicitly {@link omnora.NspEnvelope.verify|verify} messages.
         * @param message NspEnvelope message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.INspEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NspEnvelope message, length delimited. Does not implicitly {@link omnora.NspEnvelope.verify|verify} messages.
         * @param message NspEnvelope message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.INspEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NspEnvelope message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NspEnvelope
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.NspEnvelope;

        /**
         * Decodes a NspEnvelope message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NspEnvelope
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.NspEnvelope;

        /**
         * Verifies a NspEnvelope message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NspEnvelope message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NspEnvelope
         */
        public static fromObject(object: { [k: string]: any }): omnora.NspEnvelope;

        /**
         * Creates a plain object from a NspEnvelope message. Also converts values to other types if specified.
         * @param message NspEnvelope
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.NspEnvelope, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NspEnvelope to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DetectionHistoryRequest. */
    interface IDetectionHistoryRequest {

        /** DetectionHistoryRequest nodeId */
        nodeId?: (string|null);

        /** DetectionHistoryRequest cameraNodeId */
        cameraNodeId?: (string|null);

        /** DetectionHistoryRequest detectedClass */
        detectedClass?: (string|null);

        /** DetectionHistoryRequest sinceTimestamp */
        sinceTimestamp?: (number|Long|null);

        /** DetectionHistoryRequest limit */
        limit?: (number|null);
    }

    /** Represents a DetectionHistoryRequest. */
    class DetectionHistoryRequest implements IDetectionHistoryRequest {

        /**
         * Constructs a new DetectionHistoryRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IDetectionHistoryRequest);

        /** DetectionHistoryRequest nodeId. */
        public nodeId: string;

        /** DetectionHistoryRequest cameraNodeId. */
        public cameraNodeId: string;

        /** DetectionHistoryRequest detectedClass. */
        public detectedClass: string;

        /** DetectionHistoryRequest sinceTimestamp. */
        public sinceTimestamp: (number|Long);

        /** DetectionHistoryRequest limit. */
        public limit: number;

        /**
         * Creates a new DetectionHistoryRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DetectionHistoryRequest instance
         */
        public static create(properties?: omnora.IDetectionHistoryRequest): omnora.DetectionHistoryRequest;

        /**
         * Encodes the specified DetectionHistoryRequest message. Does not implicitly {@link omnora.DetectionHistoryRequest.verify|verify} messages.
         * @param message DetectionHistoryRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IDetectionHistoryRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DetectionHistoryRequest message, length delimited. Does not implicitly {@link omnora.DetectionHistoryRequest.verify|verify} messages.
         * @param message DetectionHistoryRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IDetectionHistoryRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DetectionHistoryRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DetectionHistoryRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.DetectionHistoryRequest;

        /**
         * Decodes a DetectionHistoryRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DetectionHistoryRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.DetectionHistoryRequest;

        /**
         * Verifies a DetectionHistoryRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DetectionHistoryRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DetectionHistoryRequest
         */
        public static fromObject(object: { [k: string]: any }): omnora.DetectionHistoryRequest;

        /**
         * Creates a plain object from a DetectionHistoryRequest message. Also converts values to other types if specified.
         * @param message DetectionHistoryRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.DetectionHistoryRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DetectionHistoryRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DetectionHistoryResponse. */
    interface IDetectionHistoryResponse {

        /** DetectionHistoryResponse events */
        events?: (omnora.IDetectionEvent[]|null);

        /** DetectionHistoryResponse totalCount */
        totalCount?: (number|null);
    }

    /** Represents a DetectionHistoryResponse. */
    class DetectionHistoryResponse implements IDetectionHistoryResponse {

        /**
         * Constructs a new DetectionHistoryResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IDetectionHistoryResponse);

        /** DetectionHistoryResponse events. */
        public events: omnora.IDetectionEvent[];

        /** DetectionHistoryResponse totalCount. */
        public totalCount: number;

        /**
         * Creates a new DetectionHistoryResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DetectionHistoryResponse instance
         */
        public static create(properties?: omnora.IDetectionHistoryResponse): omnora.DetectionHistoryResponse;

        /**
         * Encodes the specified DetectionHistoryResponse message. Does not implicitly {@link omnora.DetectionHistoryResponse.verify|verify} messages.
         * @param message DetectionHistoryResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IDetectionHistoryResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DetectionHistoryResponse message, length delimited. Does not implicitly {@link omnora.DetectionHistoryResponse.verify|verify} messages.
         * @param message DetectionHistoryResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IDetectionHistoryResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DetectionHistoryResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DetectionHistoryResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.DetectionHistoryResponse;

        /**
         * Decodes a DetectionHistoryResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DetectionHistoryResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.DetectionHistoryResponse;

        /**
         * Verifies a DetectionHistoryResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DetectionHistoryResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DetectionHistoryResponse
         */
        public static fromObject(object: { [k: string]: any }): omnora.DetectionHistoryResponse;

        /**
         * Creates a plain object from a DetectionHistoryResponse message. Also converts values to other types if specified.
         * @param message DetectionHistoryResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.DetectionHistoryResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DetectionHistoryResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DetectionEvent. */
    interface IDetectionEvent {

        /** DetectionEvent eventId */
        eventId?: (string|null);

        /** DetectionEvent cameraLabel */
        cameraLabel?: (string|null);

        /** DetectionEvent installLocation */
        installLocation?: (string|null);

        /** DetectionEvent detectedClass */
        detectedClass?: (string|null);

        /** DetectionEvent confidence */
        confidence?: (number|null);

        /** DetectionEvent zoneId */
        zoneId?: (string|null);

        /** DetectionEvent zoneLabel */
        zoneLabel?: (string|null);

        /** DetectionEvent createdAt */
        createdAt?: (number|Long|null);

        /** DetectionEvent thumbnailUrl */
        thumbnailUrl?: (string|null);
    }

    /** Represents a DetectionEvent. */
    class DetectionEvent implements IDetectionEvent {

        /**
         * Constructs a new DetectionEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IDetectionEvent);

        /** DetectionEvent eventId. */
        public eventId: string;

        /** DetectionEvent cameraLabel. */
        public cameraLabel: string;

        /** DetectionEvent installLocation. */
        public installLocation: string;

        /** DetectionEvent detectedClass. */
        public detectedClass: string;

        /** DetectionEvent confidence. */
        public confidence: number;

        /** DetectionEvent zoneId. */
        public zoneId: string;

        /** DetectionEvent zoneLabel. */
        public zoneLabel: string;

        /** DetectionEvent createdAt. */
        public createdAt: (number|Long);

        /** DetectionEvent thumbnailUrl. */
        public thumbnailUrl: string;

        /**
         * Creates a new DetectionEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DetectionEvent instance
         */
        public static create(properties?: omnora.IDetectionEvent): omnora.DetectionEvent;

        /**
         * Encodes the specified DetectionEvent message. Does not implicitly {@link omnora.DetectionEvent.verify|verify} messages.
         * @param message DetectionEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IDetectionEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DetectionEvent message, length delimited. Does not implicitly {@link omnora.DetectionEvent.verify|verify} messages.
         * @param message DetectionEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IDetectionEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DetectionEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DetectionEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.DetectionEvent;

        /**
         * Decodes a DetectionEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DetectionEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.DetectionEvent;

        /**
         * Verifies a DetectionEvent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DetectionEvent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DetectionEvent
         */
        public static fromObject(object: { [k: string]: any }): omnora.DetectionEvent;

        /**
         * Creates a plain object from a DetectionEvent message. Also converts values to other types if specified.
         * @param message DetectionEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.DetectionEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DetectionEvent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CameraStatusRequest. */
    interface ICameraStatusRequest {

        /** CameraStatusRequest nodeId */
        nodeId?: (string|null);
    }

    /** Represents a CameraStatusRequest. */
    class CameraStatusRequest implements ICameraStatusRequest {

        /**
         * Constructs a new CameraStatusRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.ICameraStatusRequest);

        /** CameraStatusRequest nodeId. */
        public nodeId: string;

        /**
         * Creates a new CameraStatusRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CameraStatusRequest instance
         */
        public static create(properties?: omnora.ICameraStatusRequest): omnora.CameraStatusRequest;

        /**
         * Encodes the specified CameraStatusRequest message. Does not implicitly {@link omnora.CameraStatusRequest.verify|verify} messages.
         * @param message CameraStatusRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.ICameraStatusRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CameraStatusRequest message, length delimited. Does not implicitly {@link omnora.CameraStatusRequest.verify|verify} messages.
         * @param message CameraStatusRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.ICameraStatusRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CameraStatusRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CameraStatusRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.CameraStatusRequest;

        /**
         * Decodes a CameraStatusRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CameraStatusRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.CameraStatusRequest;

        /**
         * Verifies a CameraStatusRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CameraStatusRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CameraStatusRequest
         */
        public static fromObject(object: { [k: string]: any }): omnora.CameraStatusRequest;

        /**
         * Creates a plain object from a CameraStatusRequest message. Also converts values to other types if specified.
         * @param message CameraStatusRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.CameraStatusRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CameraStatusRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CameraStatusResponse. */
    interface ICameraStatusResponse {

        /** CameraStatusResponse cameras */
        cameras?: (omnora.ICameraStatusItem[]|null);
    }

    /** Represents a CameraStatusResponse. */
    class CameraStatusResponse implements ICameraStatusResponse {

        /**
         * Constructs a new CameraStatusResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.ICameraStatusResponse);

        /** CameraStatusResponse cameras. */
        public cameras: omnora.ICameraStatusItem[];

        /**
         * Creates a new CameraStatusResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CameraStatusResponse instance
         */
        public static create(properties?: omnora.ICameraStatusResponse): omnora.CameraStatusResponse;

        /**
         * Encodes the specified CameraStatusResponse message. Does not implicitly {@link omnora.CameraStatusResponse.verify|verify} messages.
         * @param message CameraStatusResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.ICameraStatusResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CameraStatusResponse message, length delimited. Does not implicitly {@link omnora.CameraStatusResponse.verify|verify} messages.
         * @param message CameraStatusResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.ICameraStatusResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CameraStatusResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CameraStatusResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.CameraStatusResponse;

        /**
         * Decodes a CameraStatusResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CameraStatusResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.CameraStatusResponse;

        /**
         * Verifies a CameraStatusResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CameraStatusResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CameraStatusResponse
         */
        public static fromObject(object: { [k: string]: any }): omnora.CameraStatusResponse;

        /**
         * Creates a plain object from a CameraStatusResponse message. Also converts values to other types if specified.
         * @param message CameraStatusResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.CameraStatusResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CameraStatusResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CameraStatusItem. */
    interface ICameraStatusItem {

        /** CameraStatusItem cameraId */
        cameraId?: (string|null);

        /** CameraStatusItem label */
        label?: (string|null);

        /** CameraStatusItem location */
        location?: (string|null);

        /** CameraStatusItem brand */
        brand?: (string|null);

        /** CameraStatusItem modelNumber */
        modelNumber?: (string|null);

        /** CameraStatusItem status */
        status?: (string|null);

        /** CameraStatusItem lastFrameAt */
        lastFrameAt?: (number|Long|null);

        /** CameraStatusItem bitrateKbps */
        bitrateKbps?: (number|null);

        /** CameraStatusItem avgBrightness */
        avgBrightness?: (number|null);

        /** CameraStatusItem aiEnabled */
        aiEnabled?: (boolean|null);

        /** CameraStatusItem activeFault */
        activeFault?: (string|null);
    }

    /** Represents a CameraStatusItem. */
    class CameraStatusItem implements ICameraStatusItem {

        /**
         * Constructs a new CameraStatusItem.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.ICameraStatusItem);

        /** CameraStatusItem cameraId. */
        public cameraId: string;

        /** CameraStatusItem label. */
        public label: string;

        /** CameraStatusItem location. */
        public location: string;

        /** CameraStatusItem brand. */
        public brand: string;

        /** CameraStatusItem modelNumber. */
        public modelNumber: string;

        /** CameraStatusItem status. */
        public status: string;

        /** CameraStatusItem lastFrameAt. */
        public lastFrameAt: (number|Long);

        /** CameraStatusItem bitrateKbps. */
        public bitrateKbps: number;

        /** CameraStatusItem avgBrightness. */
        public avgBrightness: number;

        /** CameraStatusItem aiEnabled. */
        public aiEnabled: boolean;

        /** CameraStatusItem activeFault. */
        public activeFault: string;

        /**
         * Creates a new CameraStatusItem instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CameraStatusItem instance
         */
        public static create(properties?: omnora.ICameraStatusItem): omnora.CameraStatusItem;

        /**
         * Encodes the specified CameraStatusItem message. Does not implicitly {@link omnora.CameraStatusItem.verify|verify} messages.
         * @param message CameraStatusItem message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.ICameraStatusItem, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CameraStatusItem message, length delimited. Does not implicitly {@link omnora.CameraStatusItem.verify|verify} messages.
         * @param message CameraStatusItem message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.ICameraStatusItem, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CameraStatusItem message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CameraStatusItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.CameraStatusItem;

        /**
         * Decodes a CameraStatusItem message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CameraStatusItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.CameraStatusItem;

        /**
         * Verifies a CameraStatusItem message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CameraStatusItem message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CameraStatusItem
         */
        public static fromObject(object: { [k: string]: any }): omnora.CameraStatusItem;

        /**
         * Creates a plain object from a CameraStatusItem message. Also converts values to other types if specified.
         * @param message CameraStatusItem
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.CameraStatusItem, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CameraStatusItem to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LedgerSummaryRequest. */
    interface ILedgerSummaryRequest {

        /** LedgerSummaryRequest nodeId */
        nodeId?: (string|null);

        /** LedgerSummaryRequest dateFrom */
        dateFrom?: (string|null);

        /** LedgerSummaryRequest dateTo */
        dateTo?: (string|null);

        /** LedgerSummaryRequest limit */
        limit?: (number|null);
    }

    /** Represents a LedgerSummaryRequest. */
    class LedgerSummaryRequest implements ILedgerSummaryRequest {

        /**
         * Constructs a new LedgerSummaryRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.ILedgerSummaryRequest);

        /** LedgerSummaryRequest nodeId. */
        public nodeId: string;

        /** LedgerSummaryRequest dateFrom. */
        public dateFrom: string;

        /** LedgerSummaryRequest dateTo. */
        public dateTo: string;

        /** LedgerSummaryRequest limit. */
        public limit: number;

        /**
         * Creates a new LedgerSummaryRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LedgerSummaryRequest instance
         */
        public static create(properties?: omnora.ILedgerSummaryRequest): omnora.LedgerSummaryRequest;

        /**
         * Encodes the specified LedgerSummaryRequest message. Does not implicitly {@link omnora.LedgerSummaryRequest.verify|verify} messages.
         * @param message LedgerSummaryRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.ILedgerSummaryRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LedgerSummaryRequest message, length delimited. Does not implicitly {@link omnora.LedgerSummaryRequest.verify|verify} messages.
         * @param message LedgerSummaryRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.ILedgerSummaryRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LedgerSummaryRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LedgerSummaryRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.LedgerSummaryRequest;

        /**
         * Decodes a LedgerSummaryRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LedgerSummaryRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.LedgerSummaryRequest;

        /**
         * Verifies a LedgerSummaryRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LedgerSummaryRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LedgerSummaryRequest
         */
        public static fromObject(object: { [k: string]: any }): omnora.LedgerSummaryRequest;

        /**
         * Creates a plain object from a LedgerSummaryRequest message. Also converts values to other types if specified.
         * @param message LedgerSummaryRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.LedgerSummaryRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LedgerSummaryRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LedgerSummaryResponse. */
    interface ILedgerSummaryResponse {

        /** LedgerSummaryResponse entries */
        entries?: (omnora.ILedgerEntryItem[]|null);

        /** LedgerSummaryResponse totalDebit */
        totalDebit?: (string|null);

        /** LedgerSummaryResponse totalCredit */
        totalCredit?: (string|null);

        /** LedgerSummaryResponse netBalance */
        netBalance?: (string|null);
    }

    /** Represents a LedgerSummaryResponse. */
    class LedgerSummaryResponse implements ILedgerSummaryResponse {

        /**
         * Constructs a new LedgerSummaryResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.ILedgerSummaryResponse);

        /** LedgerSummaryResponse entries. */
        public entries: omnora.ILedgerEntryItem[];

        /** LedgerSummaryResponse totalDebit. */
        public totalDebit: string;

        /** LedgerSummaryResponse totalCredit. */
        public totalCredit: string;

        /** LedgerSummaryResponse netBalance. */
        public netBalance: string;

        /**
         * Creates a new LedgerSummaryResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LedgerSummaryResponse instance
         */
        public static create(properties?: omnora.ILedgerSummaryResponse): omnora.LedgerSummaryResponse;

        /**
         * Encodes the specified LedgerSummaryResponse message. Does not implicitly {@link omnora.LedgerSummaryResponse.verify|verify} messages.
         * @param message LedgerSummaryResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.ILedgerSummaryResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LedgerSummaryResponse message, length delimited. Does not implicitly {@link omnora.LedgerSummaryResponse.verify|verify} messages.
         * @param message LedgerSummaryResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.ILedgerSummaryResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LedgerSummaryResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LedgerSummaryResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.LedgerSummaryResponse;

        /**
         * Decodes a LedgerSummaryResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LedgerSummaryResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.LedgerSummaryResponse;

        /**
         * Verifies a LedgerSummaryResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LedgerSummaryResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LedgerSummaryResponse
         */
        public static fromObject(object: { [k: string]: any }): omnora.LedgerSummaryResponse;

        /**
         * Creates a plain object from a LedgerSummaryResponse message. Also converts values to other types if specified.
         * @param message LedgerSummaryResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.LedgerSummaryResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LedgerSummaryResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LedgerEntryItem. */
    interface ILedgerEntryItem {

        /** LedgerEntryItem entryId */
        entryId?: (string|null);

        /** LedgerEntryItem txRef */
        txRef?: (string|null);

        /** LedgerEntryItem accountName */
        accountName?: (string|null);

        /** LedgerEntryItem partyName */
        partyName?: (string|null);

        /** LedgerEntryItem entryType */
        entryType?: (string|null);

        /** LedgerEntryItem amount */
        amount?: (string|null);

        /** LedgerEntryItem description */
        description?: (string|null);

        /** LedgerEntryItem postedAt */
        postedAt?: (number|Long|null);
    }

    /** Represents a LedgerEntryItem. */
    class LedgerEntryItem implements ILedgerEntryItem {

        /**
         * Constructs a new LedgerEntryItem.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.ILedgerEntryItem);

        /** LedgerEntryItem entryId. */
        public entryId: string;

        /** LedgerEntryItem txRef. */
        public txRef: string;

        /** LedgerEntryItem accountName. */
        public accountName: string;

        /** LedgerEntryItem partyName. */
        public partyName: string;

        /** LedgerEntryItem entryType. */
        public entryType: string;

        /** LedgerEntryItem amount. */
        public amount: string;

        /** LedgerEntryItem description. */
        public description: string;

        /** LedgerEntryItem postedAt. */
        public postedAt: (number|Long);

        /**
         * Creates a new LedgerEntryItem instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LedgerEntryItem instance
         */
        public static create(properties?: omnora.ILedgerEntryItem): omnora.LedgerEntryItem;

        /**
         * Encodes the specified LedgerEntryItem message. Does not implicitly {@link omnora.LedgerEntryItem.verify|verify} messages.
         * @param message LedgerEntryItem message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.ILedgerEntryItem, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LedgerEntryItem message, length delimited. Does not implicitly {@link omnora.LedgerEntryItem.verify|verify} messages.
         * @param message LedgerEntryItem message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.ILedgerEntryItem, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LedgerEntryItem message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LedgerEntryItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.LedgerEntryItem;

        /**
         * Decodes a LedgerEntryItem message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LedgerEntryItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.LedgerEntryItem;

        /**
         * Verifies a LedgerEntryItem message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LedgerEntryItem message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LedgerEntryItem
         */
        public static fromObject(object: { [k: string]: any }): omnora.LedgerEntryItem;

        /**
         * Creates a plain object from a LedgerEntryItem message. Also converts values to other types if specified.
         * @param message LedgerEntryItem
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.LedgerEntryItem, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LedgerEntryItem to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PartyBalanceRequest. */
    interface IPartyBalanceRequest {

        /** PartyBalanceRequest nodeId */
        nodeId?: (string|null);

        /** PartyBalanceRequest partyType */
        partyType?: (string|null);

        /** PartyBalanceRequest limit */
        limit?: (number|null);
    }

    /** Represents a PartyBalanceRequest. */
    class PartyBalanceRequest implements IPartyBalanceRequest {

        /**
         * Constructs a new PartyBalanceRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IPartyBalanceRequest);

        /** PartyBalanceRequest nodeId. */
        public nodeId: string;

        /** PartyBalanceRequest partyType. */
        public partyType: string;

        /** PartyBalanceRequest limit. */
        public limit: number;

        /**
         * Creates a new PartyBalanceRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PartyBalanceRequest instance
         */
        public static create(properties?: omnora.IPartyBalanceRequest): omnora.PartyBalanceRequest;

        /**
         * Encodes the specified PartyBalanceRequest message. Does not implicitly {@link omnora.PartyBalanceRequest.verify|verify} messages.
         * @param message PartyBalanceRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IPartyBalanceRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PartyBalanceRequest message, length delimited. Does not implicitly {@link omnora.PartyBalanceRequest.verify|verify} messages.
         * @param message PartyBalanceRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IPartyBalanceRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PartyBalanceRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PartyBalanceRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.PartyBalanceRequest;

        /**
         * Decodes a PartyBalanceRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PartyBalanceRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.PartyBalanceRequest;

        /**
         * Verifies a PartyBalanceRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PartyBalanceRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PartyBalanceRequest
         */
        public static fromObject(object: { [k: string]: any }): omnora.PartyBalanceRequest;

        /**
         * Creates a plain object from a PartyBalanceRequest message. Also converts values to other types if specified.
         * @param message PartyBalanceRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.PartyBalanceRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PartyBalanceRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PartyBalanceResponse. */
    interface IPartyBalanceResponse {

        /** PartyBalanceResponse parties */
        parties?: (omnora.IPartyBalanceItem[]|null);
    }

    /** Represents a PartyBalanceResponse. */
    class PartyBalanceResponse implements IPartyBalanceResponse {

        /**
         * Constructs a new PartyBalanceResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IPartyBalanceResponse);

        /** PartyBalanceResponse parties. */
        public parties: omnora.IPartyBalanceItem[];

        /**
         * Creates a new PartyBalanceResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PartyBalanceResponse instance
         */
        public static create(properties?: omnora.IPartyBalanceResponse): omnora.PartyBalanceResponse;

        /**
         * Encodes the specified PartyBalanceResponse message. Does not implicitly {@link omnora.PartyBalanceResponse.verify|verify} messages.
         * @param message PartyBalanceResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IPartyBalanceResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PartyBalanceResponse message, length delimited. Does not implicitly {@link omnora.PartyBalanceResponse.verify|verify} messages.
         * @param message PartyBalanceResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IPartyBalanceResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PartyBalanceResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PartyBalanceResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.PartyBalanceResponse;

        /**
         * Decodes a PartyBalanceResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PartyBalanceResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.PartyBalanceResponse;

        /**
         * Verifies a PartyBalanceResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PartyBalanceResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PartyBalanceResponse
         */
        public static fromObject(object: { [k: string]: any }): omnora.PartyBalanceResponse;

        /**
         * Creates a plain object from a PartyBalanceResponse message. Also converts values to other types if specified.
         * @param message PartyBalanceResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.PartyBalanceResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PartyBalanceResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PartyBalanceItem. */
    interface IPartyBalanceItem {

        /** PartyBalanceItem partyId */
        partyId?: (string|null);

        /** PartyBalanceItem name */
        name?: (string|null);

        /** PartyBalanceItem currentBalance */
        currentBalance?: (string|null);

        /** PartyBalanceItem isBlocked */
        isBlocked?: (boolean|null);

        /** PartyBalanceItem partyType */
        partyType?: (string|null);

        /** PartyBalanceItem overdueDays */
        overdueDays?: (number|null);
    }

    /** Represents a PartyBalanceItem. */
    class PartyBalanceItem implements IPartyBalanceItem {

        /**
         * Constructs a new PartyBalanceItem.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IPartyBalanceItem);

        /** PartyBalanceItem partyId. */
        public partyId: string;

        /** PartyBalanceItem name. */
        public name: string;

        /** PartyBalanceItem currentBalance. */
        public currentBalance: string;

        /** PartyBalanceItem isBlocked. */
        public isBlocked: boolean;

        /** PartyBalanceItem partyType. */
        public partyType: string;

        /** PartyBalanceItem overdueDays. */
        public overdueDays: number;

        /**
         * Creates a new PartyBalanceItem instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PartyBalanceItem instance
         */
        public static create(properties?: omnora.IPartyBalanceItem): omnora.PartyBalanceItem;

        /**
         * Encodes the specified PartyBalanceItem message. Does not implicitly {@link omnora.PartyBalanceItem.verify|verify} messages.
         * @param message PartyBalanceItem message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IPartyBalanceItem, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PartyBalanceItem message, length delimited. Does not implicitly {@link omnora.PartyBalanceItem.verify|verify} messages.
         * @param message PartyBalanceItem message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IPartyBalanceItem, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PartyBalanceItem message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PartyBalanceItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.PartyBalanceItem;

        /**
         * Decodes a PartyBalanceItem message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PartyBalanceItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.PartyBalanceItem;

        /**
         * Verifies a PartyBalanceItem message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PartyBalanceItem message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PartyBalanceItem
         */
        public static fromObject(object: { [k: string]: any }): omnora.PartyBalanceItem;

        /**
         * Creates a plain object from a PartyBalanceItem message. Also converts values to other types if specified.
         * @param message PartyBalanceItem
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.PartyBalanceItem, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PartyBalanceItem to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an InvoiceSummaryRequest. */
    interface IInvoiceSummaryRequest {

        /** InvoiceSummaryRequest nodeId */
        nodeId?: (string|null);

        /** InvoiceSummaryRequest dateFrom */
        dateFrom?: (string|null);

        /** InvoiceSummaryRequest dateTo */
        dateTo?: (string|null);
    }

    /** Represents an InvoiceSummaryRequest. */
    class InvoiceSummaryRequest implements IInvoiceSummaryRequest {

        /**
         * Constructs a new InvoiceSummaryRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IInvoiceSummaryRequest);

        /** InvoiceSummaryRequest nodeId. */
        public nodeId: string;

        /** InvoiceSummaryRequest dateFrom. */
        public dateFrom: string;

        /** InvoiceSummaryRequest dateTo. */
        public dateTo: string;

        /**
         * Creates a new InvoiceSummaryRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns InvoiceSummaryRequest instance
         */
        public static create(properties?: omnora.IInvoiceSummaryRequest): omnora.InvoiceSummaryRequest;

        /**
         * Encodes the specified InvoiceSummaryRequest message. Does not implicitly {@link omnora.InvoiceSummaryRequest.verify|verify} messages.
         * @param message InvoiceSummaryRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IInvoiceSummaryRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified InvoiceSummaryRequest message, length delimited. Does not implicitly {@link omnora.InvoiceSummaryRequest.verify|verify} messages.
         * @param message InvoiceSummaryRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IInvoiceSummaryRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an InvoiceSummaryRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns InvoiceSummaryRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.InvoiceSummaryRequest;

        /**
         * Decodes an InvoiceSummaryRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns InvoiceSummaryRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.InvoiceSummaryRequest;

        /**
         * Verifies an InvoiceSummaryRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an InvoiceSummaryRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns InvoiceSummaryRequest
         */
        public static fromObject(object: { [k: string]: any }): omnora.InvoiceSummaryRequest;

        /**
         * Creates a plain object from an InvoiceSummaryRequest message. Also converts values to other types if specified.
         * @param message InvoiceSummaryRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.InvoiceSummaryRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this InvoiceSummaryRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an InvoiceSummaryResponse. */
    interface IInvoiceSummaryResponse {

        /** InvoiceSummaryResponse invoices */
        invoices?: (omnora.IInvoiceSummaryItem[]|null);

        /** InvoiceSummaryResponse totalValue */
        totalValue?: (string|null);

        /** InvoiceSummaryResponse count */
        count?: (number|null);
    }

    /** Represents an InvoiceSummaryResponse. */
    class InvoiceSummaryResponse implements IInvoiceSummaryResponse {

        /**
         * Constructs a new InvoiceSummaryResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IInvoiceSummaryResponse);

        /** InvoiceSummaryResponse invoices. */
        public invoices: omnora.IInvoiceSummaryItem[];

        /** InvoiceSummaryResponse totalValue. */
        public totalValue: string;

        /** InvoiceSummaryResponse count. */
        public count: number;

        /**
         * Creates a new InvoiceSummaryResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns InvoiceSummaryResponse instance
         */
        public static create(properties?: omnora.IInvoiceSummaryResponse): omnora.InvoiceSummaryResponse;

        /**
         * Encodes the specified InvoiceSummaryResponse message. Does not implicitly {@link omnora.InvoiceSummaryResponse.verify|verify} messages.
         * @param message InvoiceSummaryResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IInvoiceSummaryResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified InvoiceSummaryResponse message, length delimited. Does not implicitly {@link omnora.InvoiceSummaryResponse.verify|verify} messages.
         * @param message InvoiceSummaryResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IInvoiceSummaryResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an InvoiceSummaryResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns InvoiceSummaryResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.InvoiceSummaryResponse;

        /**
         * Decodes an InvoiceSummaryResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns InvoiceSummaryResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.InvoiceSummaryResponse;

        /**
         * Verifies an InvoiceSummaryResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an InvoiceSummaryResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns InvoiceSummaryResponse
         */
        public static fromObject(object: { [k: string]: any }): omnora.InvoiceSummaryResponse;

        /**
         * Creates a plain object from an InvoiceSummaryResponse message. Also converts values to other types if specified.
         * @param message InvoiceSummaryResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.InvoiceSummaryResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this InvoiceSummaryResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an InvoiceSummaryItem. */
    interface IInvoiceSummaryItem {

        /** InvoiceSummaryItem invoiceId */
        invoiceId?: (string|null);

        /** InvoiceSummaryItem invoiceNo */
        invoiceNo?: (string|null);

        /** InvoiceSummaryItem partyName */
        partyName?: (string|null);

        /** InvoiceSummaryItem total */
        total?: (string|null);

        /** InvoiceSummaryItem balanceDue */
        balanceDue?: (string|null);

        /** InvoiceSummaryItem status */
        status?: (string|null);

        /** InvoiceSummaryItem issueDate */
        issueDate?: (number|Long|null);

        /** InvoiceSummaryItem dueDate */
        dueDate?: (number|Long|null);
    }

    /** Represents an InvoiceSummaryItem. */
    class InvoiceSummaryItem implements IInvoiceSummaryItem {

        /**
         * Constructs a new InvoiceSummaryItem.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IInvoiceSummaryItem);

        /** InvoiceSummaryItem invoiceId. */
        public invoiceId: string;

        /** InvoiceSummaryItem invoiceNo. */
        public invoiceNo: string;

        /** InvoiceSummaryItem partyName. */
        public partyName: string;

        /** InvoiceSummaryItem total. */
        public total: string;

        /** InvoiceSummaryItem balanceDue. */
        public balanceDue: string;

        /** InvoiceSummaryItem status. */
        public status: string;

        /** InvoiceSummaryItem issueDate. */
        public issueDate: (number|Long);

        /** InvoiceSummaryItem dueDate. */
        public dueDate: (number|Long);

        /**
         * Creates a new InvoiceSummaryItem instance using the specified properties.
         * @param [properties] Properties to set
         * @returns InvoiceSummaryItem instance
         */
        public static create(properties?: omnora.IInvoiceSummaryItem): omnora.InvoiceSummaryItem;

        /**
         * Encodes the specified InvoiceSummaryItem message. Does not implicitly {@link omnora.InvoiceSummaryItem.verify|verify} messages.
         * @param message InvoiceSummaryItem message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IInvoiceSummaryItem, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified InvoiceSummaryItem message, length delimited. Does not implicitly {@link omnora.InvoiceSummaryItem.verify|verify} messages.
         * @param message InvoiceSummaryItem message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IInvoiceSummaryItem, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an InvoiceSummaryItem message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns InvoiceSummaryItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.InvoiceSummaryItem;

        /**
         * Decodes an InvoiceSummaryItem message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns InvoiceSummaryItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.InvoiceSummaryItem;

        /**
         * Verifies an InvoiceSummaryItem message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an InvoiceSummaryItem message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns InvoiceSummaryItem
         */
        public static fromObject(object: { [k: string]: any }): omnora.InvoiceSummaryItem;

        /**
         * Creates a plain object from an InvoiceSummaryItem message. Also converts values to other types if specified.
         * @param message InvoiceSummaryItem
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.InvoiceSummaryItem, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this InvoiceSummaryItem to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PaySlipRequest. */
    interface IPaySlipRequest {

        /** PaySlipRequest nodeId */
        nodeId?: (string|null);

        /** PaySlipRequest karigarId */
        karigarId?: (string|null);

        /** PaySlipRequest periodId */
        periodId?: (string|null);
    }

    /** Represents a PaySlipRequest. */
    class PaySlipRequest implements IPaySlipRequest {

        /**
         * Constructs a new PaySlipRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IPaySlipRequest);

        /** PaySlipRequest nodeId. */
        public nodeId: string;

        /** PaySlipRequest karigarId. */
        public karigarId: string;

        /** PaySlipRequest periodId. */
        public periodId: string;

        /**
         * Creates a new PaySlipRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PaySlipRequest instance
         */
        public static create(properties?: omnora.IPaySlipRequest): omnora.PaySlipRequest;

        /**
         * Encodes the specified PaySlipRequest message. Does not implicitly {@link omnora.PaySlipRequest.verify|verify} messages.
         * @param message PaySlipRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IPaySlipRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PaySlipRequest message, length delimited. Does not implicitly {@link omnora.PaySlipRequest.verify|verify} messages.
         * @param message PaySlipRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IPaySlipRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PaySlipRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PaySlipRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.PaySlipRequest;

        /**
         * Decodes a PaySlipRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PaySlipRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.PaySlipRequest;

        /**
         * Verifies a PaySlipRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PaySlipRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PaySlipRequest
         */
        public static fromObject(object: { [k: string]: any }): omnora.PaySlipRequest;

        /**
         * Creates a plain object from a PaySlipRequest message. Also converts values to other types if specified.
         * @param message PaySlipRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.PaySlipRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PaySlipRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PaySlipResponse. */
    interface IPaySlipResponse {

        /** PaySlipResponse karigarName */
        karigarName?: (string|null);

        /** PaySlipResponse periodLabel */
        periodLabel?: (string|null);

        /** PaySlipResponse grossEarning */
        grossEarning?: (string|null);

        /** PaySlipResponse totalDeductions */
        totalDeductions?: (string|null);

        /** PaySlipResponse netPayable */
        netPayable?: (string|null);

        /** PaySlipResponse daysPresent */
        daysPresent?: (number|null);

        /** PaySlipResponse totalUnits */
        totalUnits?: (string|null);

        /** PaySlipResponse efficiencyPct */
        efficiencyPct?: (string|null);

        /** PaySlipResponse advanceDeduction */
        advanceDeduction?: (string|null);
    }

    /** Represents a PaySlipResponse. */
    class PaySlipResponse implements IPaySlipResponse {

        /**
         * Constructs a new PaySlipResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IPaySlipResponse);

        /** PaySlipResponse karigarName. */
        public karigarName: string;

        /** PaySlipResponse periodLabel. */
        public periodLabel: string;

        /** PaySlipResponse grossEarning. */
        public grossEarning: string;

        /** PaySlipResponse totalDeductions. */
        public totalDeductions: string;

        /** PaySlipResponse netPayable. */
        public netPayable: string;

        /** PaySlipResponse daysPresent. */
        public daysPresent: number;

        /** PaySlipResponse totalUnits. */
        public totalUnits: string;

        /** PaySlipResponse efficiencyPct. */
        public efficiencyPct: string;

        /** PaySlipResponse advanceDeduction. */
        public advanceDeduction: string;

        /**
         * Creates a new PaySlipResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PaySlipResponse instance
         */
        public static create(properties?: omnora.IPaySlipResponse): omnora.PaySlipResponse;

        /**
         * Encodes the specified PaySlipResponse message. Does not implicitly {@link omnora.PaySlipResponse.verify|verify} messages.
         * @param message PaySlipResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IPaySlipResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PaySlipResponse message, length delimited. Does not implicitly {@link omnora.PaySlipResponse.verify|verify} messages.
         * @param message PaySlipResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IPaySlipResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PaySlipResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PaySlipResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.PaySlipResponse;

        /**
         * Decodes a PaySlipResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PaySlipResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.PaySlipResponse;

        /**
         * Verifies a PaySlipResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PaySlipResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PaySlipResponse
         */
        public static fromObject(object: { [k: string]: any }): omnora.PaySlipResponse;

        /**
         * Creates a plain object from a PaySlipResponse message. Also converts values to other types if specified.
         * @param message PaySlipResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.PaySlipResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PaySlipResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a BranchListRequest. */
    interface IBranchListRequest {

        /** BranchListRequest nodeId */
        nodeId?: (string|null);
    }

    /** Represents a BranchListRequest. */
    class BranchListRequest implements IBranchListRequest {

        /**
         * Constructs a new BranchListRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IBranchListRequest);

        /** BranchListRequest nodeId. */
        public nodeId: string;

        /**
         * Creates a new BranchListRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BranchListRequest instance
         */
        public static create(properties?: omnora.IBranchListRequest): omnora.BranchListRequest;

        /**
         * Encodes the specified BranchListRequest message. Does not implicitly {@link omnora.BranchListRequest.verify|verify} messages.
         * @param message BranchListRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IBranchListRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BranchListRequest message, length delimited. Does not implicitly {@link omnora.BranchListRequest.verify|verify} messages.
         * @param message BranchListRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IBranchListRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BranchListRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BranchListRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.BranchListRequest;

        /**
         * Decodes a BranchListRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BranchListRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.BranchListRequest;

        /**
         * Verifies a BranchListRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BranchListRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BranchListRequest
         */
        public static fromObject(object: { [k: string]: any }): omnora.BranchListRequest;

        /**
         * Creates a plain object from a BranchListRequest message. Also converts values to other types if specified.
         * @param message BranchListRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.BranchListRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BranchListRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a BranchListResponse. */
    interface IBranchListResponse {

        /** BranchListResponse branches */
        branches?: (omnora.IBranchItem[]|null);

        /** BranchListResponse currentBranchId */
        currentBranchId?: (string|null);
    }

    /** Represents a BranchListResponse. */
    class BranchListResponse implements IBranchListResponse {

        /**
         * Constructs a new BranchListResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IBranchListResponse);

        /** BranchListResponse branches. */
        public branches: omnora.IBranchItem[];

        /** BranchListResponse currentBranchId. */
        public currentBranchId: string;

        /**
         * Creates a new BranchListResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BranchListResponse instance
         */
        public static create(properties?: omnora.IBranchListResponse): omnora.BranchListResponse;

        /**
         * Encodes the specified BranchListResponse message. Does not implicitly {@link omnora.BranchListResponse.verify|verify} messages.
         * @param message BranchListResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IBranchListResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BranchListResponse message, length delimited. Does not implicitly {@link omnora.BranchListResponse.verify|verify} messages.
         * @param message BranchListResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IBranchListResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BranchListResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BranchListResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.BranchListResponse;

        /**
         * Decodes a BranchListResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BranchListResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.BranchListResponse;

        /**
         * Verifies a BranchListResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BranchListResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BranchListResponse
         */
        public static fromObject(object: { [k: string]: any }): omnora.BranchListResponse;

        /**
         * Creates a plain object from a BranchListResponse message. Also converts values to other types if specified.
         * @param message BranchListResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.BranchListResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BranchListResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a BranchItem. */
    interface IBranchItem {

        /** BranchItem branchId */
        branchId?: (string|null);

        /** BranchItem name */
        name?: (string|null);

        /** BranchItem city */
        city?: (string|null);

        /** BranchItem isHq */
        isHq?: (boolean|null);

        /** BranchItem userRoleAtBranch */
        userRoleAtBranch?: (string|null);
    }

    /** Represents a BranchItem. */
    class BranchItem implements IBranchItem {

        /**
         * Constructs a new BranchItem.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IBranchItem);

        /** BranchItem branchId. */
        public branchId: string;

        /** BranchItem name. */
        public name: string;

        /** BranchItem city. */
        public city: string;

        /** BranchItem isHq. */
        public isHq: boolean;

        /** BranchItem userRoleAtBranch. */
        public userRoleAtBranch: string;

        /**
         * Creates a new BranchItem instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BranchItem instance
         */
        public static create(properties?: omnora.IBranchItem): omnora.BranchItem;

        /**
         * Encodes the specified BranchItem message. Does not implicitly {@link omnora.BranchItem.verify|verify} messages.
         * @param message BranchItem message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IBranchItem, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BranchItem message, length delimited. Does not implicitly {@link omnora.BranchItem.verify|verify} messages.
         * @param message BranchItem message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IBranchItem, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BranchItem message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BranchItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.BranchItem;

        /**
         * Decodes a BranchItem message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BranchItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.BranchItem;

        /**
         * Verifies a BranchItem message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BranchItem message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BranchItem
         */
        public static fromObject(object: { [k: string]: any }): omnora.BranchItem;

        /**
         * Creates a plain object from a BranchItem message. Also converts values to other types if specified.
         * @param message BranchItem
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.BranchItem, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BranchItem to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SwitchBranchRequest. */
    interface ISwitchBranchRequest {

        /** SwitchBranchRequest nodeId */
        nodeId?: (string|null);

        /** SwitchBranchRequest targetBranchId */
        targetBranchId?: (string|null);
    }

    /** Represents a SwitchBranchRequest. */
    class SwitchBranchRequest implements ISwitchBranchRequest {

        /**
         * Constructs a new SwitchBranchRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.ISwitchBranchRequest);

        /** SwitchBranchRequest nodeId. */
        public nodeId: string;

        /** SwitchBranchRequest targetBranchId. */
        public targetBranchId: string;

        /**
         * Creates a new SwitchBranchRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SwitchBranchRequest instance
         */
        public static create(properties?: omnora.ISwitchBranchRequest): omnora.SwitchBranchRequest;

        /**
         * Encodes the specified SwitchBranchRequest message. Does not implicitly {@link omnora.SwitchBranchRequest.verify|verify} messages.
         * @param message SwitchBranchRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.ISwitchBranchRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SwitchBranchRequest message, length delimited. Does not implicitly {@link omnora.SwitchBranchRequest.verify|verify} messages.
         * @param message SwitchBranchRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.ISwitchBranchRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SwitchBranchRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SwitchBranchRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.SwitchBranchRequest;

        /**
         * Decodes a SwitchBranchRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SwitchBranchRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.SwitchBranchRequest;

        /**
         * Verifies a SwitchBranchRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SwitchBranchRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SwitchBranchRequest
         */
        public static fromObject(object: { [k: string]: any }): omnora.SwitchBranchRequest;

        /**
         * Creates a plain object from a SwitchBranchRequest message. Also converts values to other types if specified.
         * @param message SwitchBranchRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.SwitchBranchRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SwitchBranchRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SwitchBranchResponse. */
    interface ISwitchBranchResponse {

        /** SwitchBranchResponse success */
        success?: (boolean|null);

        /** SwitchBranchResponse newJwt */
        newJwt?: (string|null);

        /** SwitchBranchResponse branchName */
        branchName?: (string|null);
    }

    /** Represents a SwitchBranchResponse. */
    class SwitchBranchResponse implements ISwitchBranchResponse {

        /**
         * Constructs a new SwitchBranchResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.ISwitchBranchResponse);

        /** SwitchBranchResponse success. */
        public success: boolean;

        /** SwitchBranchResponse newJwt. */
        public newJwt: string;

        /** SwitchBranchResponse branchName. */
        public branchName: string;

        /**
         * Creates a new SwitchBranchResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SwitchBranchResponse instance
         */
        public static create(properties?: omnora.ISwitchBranchResponse): omnora.SwitchBranchResponse;

        /**
         * Encodes the specified SwitchBranchResponse message. Does not implicitly {@link omnora.SwitchBranchResponse.verify|verify} messages.
         * @param message SwitchBranchResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.ISwitchBranchResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SwitchBranchResponse message, length delimited. Does not implicitly {@link omnora.SwitchBranchResponse.verify|verify} messages.
         * @param message SwitchBranchResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.ISwitchBranchResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SwitchBranchResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SwitchBranchResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.SwitchBranchResponse;

        /**
         * Decodes a SwitchBranchResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SwitchBranchResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.SwitchBranchResponse;

        /**
         * Verifies a SwitchBranchResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SwitchBranchResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SwitchBranchResponse
         */
        public static fromObject(object: { [k: string]: any }): omnora.SwitchBranchResponse;

        /**
         * Creates a plain object from a SwitchBranchResponse message. Also converts values to other types if specified.
         * @param message SwitchBranchResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.SwitchBranchResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SwitchBranchResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ScanEvent. */
    interface IScanEvent {

        /** ScanEvent nodeId */
        nodeId?: (string|null);

        /** ScanEvent workerId */
        workerId?: (string|null);

        /** ScanEvent barcode */
        barcode?: (string|null);

        /** ScanEvent timestamp */
        timestamp?: (number|Long|null);

        /** ScanEvent batchId */
        batchId?: (string|null);
    }

    /** Represents a ScanEvent. */
    class ScanEvent implements IScanEvent {

        /**
         * Constructs a new ScanEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IScanEvent);

        /** ScanEvent nodeId. */
        public nodeId: string;

        /** ScanEvent workerId. */
        public workerId: string;

        /** ScanEvent barcode. */
        public barcode: string;

        /** ScanEvent timestamp. */
        public timestamp: (number|Long);

        /** ScanEvent batchId. */
        public batchId: string;

        /**
         * Creates a new ScanEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ScanEvent instance
         */
        public static create(properties?: omnora.IScanEvent): omnora.ScanEvent;

        /**
         * Encodes the specified ScanEvent message. Does not implicitly {@link omnora.ScanEvent.verify|verify} messages.
         * @param message ScanEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IScanEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ScanEvent message, length delimited. Does not implicitly {@link omnora.ScanEvent.verify|verify} messages.
         * @param message ScanEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IScanEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ScanEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ScanEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.ScanEvent;

        /**
         * Decodes a ScanEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ScanEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.ScanEvent;

        /**
         * Verifies a ScanEvent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ScanEvent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ScanEvent
         */
        public static fromObject(object: { [k: string]: any }): omnora.ScanEvent;

        /**
         * Creates a plain object from a ScanEvent message. Also converts values to other types if specified.
         * @param message ScanEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.ScanEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ScanEvent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a HeartbeatEvent. */
    interface IHeartbeatEvent {

        /** HeartbeatEvent nodeId */
        nodeId?: (string|null);

        /** HeartbeatEvent timestamp */
        timestamp?: (number|Long|null);

        /** HeartbeatEvent batteryPercent */
        batteryPercent?: (number|null);

        /** HeartbeatEvent signalStrength */
        signalStrength?: (number|null);

        /** HeartbeatEvent queueDepth */
        queueDepth?: (number|null);
    }

    /** Represents a HeartbeatEvent. */
    class HeartbeatEvent implements IHeartbeatEvent {

        /**
         * Constructs a new HeartbeatEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IHeartbeatEvent);

        /** HeartbeatEvent nodeId. */
        public nodeId: string;

        /** HeartbeatEvent timestamp. */
        public timestamp: (number|Long);

        /** HeartbeatEvent batteryPercent. */
        public batteryPercent: number;

        /** HeartbeatEvent signalStrength. */
        public signalStrength: number;

        /** HeartbeatEvent queueDepth. */
        public queueDepth: number;

        /**
         * Creates a new HeartbeatEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HeartbeatEvent instance
         */
        public static create(properties?: omnora.IHeartbeatEvent): omnora.HeartbeatEvent;

        /**
         * Encodes the specified HeartbeatEvent message. Does not implicitly {@link omnora.HeartbeatEvent.verify|verify} messages.
         * @param message HeartbeatEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IHeartbeatEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified HeartbeatEvent message, length delimited. Does not implicitly {@link omnora.HeartbeatEvent.verify|verify} messages.
         * @param message HeartbeatEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IHeartbeatEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a HeartbeatEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HeartbeatEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.HeartbeatEvent;

        /**
         * Decodes a HeartbeatEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HeartbeatEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.HeartbeatEvent;

        /**
         * Verifies a HeartbeatEvent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a HeartbeatEvent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HeartbeatEvent
         */
        public static fromObject(object: { [k: string]: any }): omnora.HeartbeatEvent;

        /**
         * Creates a plain object from a HeartbeatEvent message. Also converts values to other types if specified.
         * @param message HeartbeatEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.HeartbeatEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this HeartbeatEvent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SOSEvent. */
    interface ISOSEvent {

        /** SOSEvent nodeId */
        nodeId?: (string|null);

        /** SOSEvent workerId */
        workerId?: (string|null);

        /** SOSEvent timestamp */
        timestamp?: (number|Long|null);

        /** SOSEvent message */
        message?: (string|null);

        /** SOSEvent location */
        location?: (string|null);
    }

    /** Represents a SOSEvent. */
    class SOSEvent implements ISOSEvent {

        /**
         * Constructs a new SOSEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.ISOSEvent);

        /** SOSEvent nodeId. */
        public nodeId: string;

        /** SOSEvent workerId. */
        public workerId: string;

        /** SOSEvent timestamp. */
        public timestamp: (number|Long);

        /** SOSEvent message. */
        public message: string;

        /** SOSEvent location. */
        public location: string;

        /**
         * Creates a new SOSEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SOSEvent instance
         */
        public static create(properties?: omnora.ISOSEvent): omnora.SOSEvent;

        /**
         * Encodes the specified SOSEvent message. Does not implicitly {@link omnora.SOSEvent.verify|verify} messages.
         * @param message SOSEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.ISOSEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SOSEvent message, length delimited. Does not implicitly {@link omnora.SOSEvent.verify|verify} messages.
         * @param message SOSEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.ISOSEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SOSEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SOSEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.SOSEvent;

        /**
         * Decodes a SOSEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SOSEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.SOSEvent;

        /**
         * Verifies a SOSEvent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SOSEvent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SOSEvent
         */
        public static fromObject(object: { [k: string]: any }): omnora.SOSEvent;

        /**
         * Creates a plain object from a SOSEvent message. Also converts values to other types if specified.
         * @param message SOSEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.SOSEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SOSEvent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an ErrorEvent. */
    interface IErrorEvent {

        /** ErrorEvent nodeId */
        nodeId?: (string|null);

        /** ErrorEvent timestamp */
        timestamp?: (number|Long|null);

        /** ErrorEvent errorCode */
        errorCode?: (string|null);

        /** ErrorEvent errorMessage */
        errorMessage?: (string|null);

        /** ErrorEvent context */
        context?: (string|null);
    }

    /** Represents an ErrorEvent. */
    class ErrorEvent implements IErrorEvent {

        /**
         * Constructs a new ErrorEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IErrorEvent);

        /** ErrorEvent nodeId. */
        public nodeId: string;

        /** ErrorEvent timestamp. */
        public timestamp: (number|Long);

        /** ErrorEvent errorCode. */
        public errorCode: string;

        /** ErrorEvent errorMessage. */
        public errorMessage: string;

        /** ErrorEvent context. */
        public context: string;

        /**
         * Creates a new ErrorEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ErrorEvent instance
         */
        public static create(properties?: omnora.IErrorEvent): omnora.ErrorEvent;

        /**
         * Encodes the specified ErrorEvent message. Does not implicitly {@link omnora.ErrorEvent.verify|verify} messages.
         * @param message ErrorEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IErrorEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ErrorEvent message, length delimited. Does not implicitly {@link omnora.ErrorEvent.verify|verify} messages.
         * @param message ErrorEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IErrorEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ErrorEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ErrorEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.ErrorEvent;

        /**
         * Decodes an ErrorEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ErrorEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.ErrorEvent;

        /**
         * Verifies an ErrorEvent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ErrorEvent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ErrorEvent
         */
        public static fromObject(object: { [k: string]: any }): omnora.ErrorEvent;

        /**
         * Creates a plain object from an ErrorEvent message. Also converts values to other types if specified.
         * @param message ErrorEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.ErrorEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ErrorEvent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a TelemetryEvent. */
    interface ITelemetryEvent {

        /** TelemetryEvent nodeId */
        nodeId?: (string|null);

        /** TelemetryEvent timestamp */
        timestamp?: (number|Long|null);

        /** TelemetryEvent batteryTemp */
        batteryTemp?: (number|null);

        /** TelemetryEvent memUsage */
        memUsage?: (number|Long|null);

        /** TelemetryEvent encLatencyMs */
        encLatencyMs?: (number|null);

        /** TelemetryEvent packetSizeBytes */
        packetSizeBytes?: (number|null);
    }

    /** Represents a TelemetryEvent. */
    class TelemetryEvent implements ITelemetryEvent {

        /**
         * Constructs a new TelemetryEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.ITelemetryEvent);

        /** TelemetryEvent nodeId. */
        public nodeId: string;

        /** TelemetryEvent timestamp. */
        public timestamp: (number|Long);

        /** TelemetryEvent batteryTemp. */
        public batteryTemp: number;

        /** TelemetryEvent memUsage. */
        public memUsage: (number|Long);

        /** TelemetryEvent encLatencyMs. */
        public encLatencyMs: number;

        /** TelemetryEvent packetSizeBytes. */
        public packetSizeBytes: number;

        /**
         * Creates a new TelemetryEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TelemetryEvent instance
         */
        public static create(properties?: omnora.ITelemetryEvent): omnora.TelemetryEvent;

        /**
         * Encodes the specified TelemetryEvent message. Does not implicitly {@link omnora.TelemetryEvent.verify|verify} messages.
         * @param message TelemetryEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.ITelemetryEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TelemetryEvent message, length delimited. Does not implicitly {@link omnora.TelemetryEvent.verify|verify} messages.
         * @param message TelemetryEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.ITelemetryEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TelemetryEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TelemetryEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.TelemetryEvent;

        /**
         * Decodes a TelemetryEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TelemetryEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.TelemetryEvent;

        /**
         * Verifies a TelemetryEvent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TelemetryEvent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TelemetryEvent
         */
        public static fromObject(object: { [k: string]: any }): omnora.TelemetryEvent;

        /**
         * Creates a plain object from a TelemetryEvent message. Also converts values to other types if specified.
         * @param message TelemetryEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.TelemetryEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TelemetryEvent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a KhataEntry. */
    interface IKhataEntry {

        /** KhataEntry entryId */
        entryId?: (string|null);

        /** KhataEntry nodeId */
        nodeId?: (string|null);

        /** KhataEntry workerId */
        workerId?: (string|null);

        /** KhataEntry debitAccount */
        debitAccount?: (string|null);

        /** KhataEntry creditAccount */
        creditAccount?: (string|null);

        /** KhataEntry amountPkr */
        amountPkr?: (number|Long|null);

        /** KhataEntry timestamp */
        timestamp?: (number|Long|null);

        /** KhataEntry syncStatus */
        syncStatus?: (string|null);
    }

    /** Represents a KhataEntry. */
    class KhataEntry implements IKhataEntry {

        /**
         * Constructs a new KhataEntry.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IKhataEntry);

        /** KhataEntry entryId. */
        public entryId: string;

        /** KhataEntry nodeId. */
        public nodeId: string;

        /** KhataEntry workerId. */
        public workerId: string;

        /** KhataEntry debitAccount. */
        public debitAccount: string;

        /** KhataEntry creditAccount. */
        public creditAccount: string;

        /** KhataEntry amountPkr. */
        public amountPkr: (number|Long);

        /** KhataEntry timestamp. */
        public timestamp: (number|Long);

        /** KhataEntry syncStatus. */
        public syncStatus: string;

        /**
         * Creates a new KhataEntry instance using the specified properties.
         * @param [properties] Properties to set
         * @returns KhataEntry instance
         */
        public static create(properties?: omnora.IKhataEntry): omnora.KhataEntry;

        /**
         * Encodes the specified KhataEntry message. Does not implicitly {@link omnora.KhataEntry.verify|verify} messages.
         * @param message KhataEntry message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IKhataEntry, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified KhataEntry message, length delimited. Does not implicitly {@link omnora.KhataEntry.verify|verify} messages.
         * @param message KhataEntry message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IKhataEntry, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a KhataEntry message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns KhataEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.KhataEntry;

        /**
         * Decodes a KhataEntry message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns KhataEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.KhataEntry;

        /**
         * Verifies a KhataEntry message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a KhataEntry message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns KhataEntry
         */
        public static fromObject(object: { [k: string]: any }): omnora.KhataEntry;

        /**
         * Creates a plain object from a KhataEntry message. Also converts values to other types if specified.
         * @param message KhataEntry
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.KhataEntry, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this KhataEntry to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a StockDelta. */
    interface IStockDelta {

        /** StockDelta deltaId */
        deltaId?: (string|null);

        /** StockDelta nodeId */
        nodeId?: (string|null);

        /** StockDelta operationType */
        operationType?: (string|null);

        /** StockDelta batchId */
        batchId?: (string|null);

        /** StockDelta qty */
        qty?: (number|null);

        /** StockDelta timestamp */
        timestamp?: (number|Long|null);

        /** StockDelta vectorClock */
        vectorClock?: (string|null);
    }

    /** Represents a StockDelta. */
    class StockDelta implements IStockDelta {

        /**
         * Constructs a new StockDelta.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IStockDelta);

        /** StockDelta deltaId. */
        public deltaId: string;

        /** StockDelta nodeId. */
        public nodeId: string;

        /** StockDelta operationType. */
        public operationType: string;

        /** StockDelta batchId. */
        public batchId: string;

        /** StockDelta qty. */
        public qty: number;

        /** StockDelta timestamp. */
        public timestamp: (number|Long);

        /** StockDelta vectorClock. */
        public vectorClock: string;

        /**
         * Creates a new StockDelta instance using the specified properties.
         * @param [properties] Properties to set
         * @returns StockDelta instance
         */
        public static create(properties?: omnora.IStockDelta): omnora.StockDelta;

        /**
         * Encodes the specified StockDelta message. Does not implicitly {@link omnora.StockDelta.verify|verify} messages.
         * @param message StockDelta message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IStockDelta, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified StockDelta message, length delimited. Does not implicitly {@link omnora.StockDelta.verify|verify} messages.
         * @param message StockDelta message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IStockDelta, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a StockDelta message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns StockDelta
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.StockDelta;

        /**
         * Decodes a StockDelta message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns StockDelta
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.StockDelta;

        /**
         * Verifies a StockDelta message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a StockDelta message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns StockDelta
         */
        public static fromObject(object: { [k: string]: any }): omnora.StockDelta;

        /**
         * Creates a plain object from a StockDelta message. Also converts values to other types if specified.
         * @param message StockDelta
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.StockDelta, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this StockDelta to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a TacticalMessage. */
    interface ITacticalMessage {

        /** TacticalMessage messageId */
        messageId?: (string|null);

        /** TacticalMessage fromNodeId */
        fromNodeId?: (string|null);

        /** TacticalMessage toNodeId */
        toNodeId?: (string|null);

        /** TacticalMessage content */
        content?: (string|null);

        /** TacticalMessage mediaType */
        mediaType?: (string|null);

        /** TacticalMessage timestamp */
        timestamp?: (number|Long|null);

        /** TacticalMessage isEncrypted */
        isEncrypted?: (boolean|null);

        /** TacticalMessage encryptedPayload */
        encryptedPayload?: (Uint8Array|null);
    }

    /** Represents a TacticalMessage. */
    class TacticalMessage implements ITacticalMessage {

        /**
         * Constructs a new TacticalMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.ITacticalMessage);

        /** TacticalMessage messageId. */
        public messageId: string;

        /** TacticalMessage fromNodeId. */
        public fromNodeId: string;

        /** TacticalMessage toNodeId. */
        public toNodeId: string;

        /** TacticalMessage content. */
        public content: string;

        /** TacticalMessage mediaType. */
        public mediaType: string;

        /** TacticalMessage timestamp. */
        public timestamp: (number|Long);

        /** TacticalMessage isEncrypted. */
        public isEncrypted: boolean;

        /** TacticalMessage encryptedPayload. */
        public encryptedPayload: Uint8Array;

        /**
         * Creates a new TacticalMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TacticalMessage instance
         */
        public static create(properties?: omnora.ITacticalMessage): omnora.TacticalMessage;

        /**
         * Encodes the specified TacticalMessage message. Does not implicitly {@link omnora.TacticalMessage.verify|verify} messages.
         * @param message TacticalMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.ITacticalMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TacticalMessage message, length delimited. Does not implicitly {@link omnora.TacticalMessage.verify|verify} messages.
         * @param message TacticalMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.ITacticalMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TacticalMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TacticalMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.TacticalMessage;

        /**
         * Decodes a TacticalMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TacticalMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.TacticalMessage;

        /**
         * Verifies a TacticalMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TacticalMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TacticalMessage
         */
        public static fromObject(object: { [k: string]: any }): omnora.TacticalMessage;

        /**
         * Creates a plain object from a TacticalMessage message. Also converts values to other types if specified.
         * @param message TacticalMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.TacticalMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TacticalMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a TypingEvent. */
    interface ITypingEvent {

        /** TypingEvent fromNodeId */
        fromNodeId?: (string|null);

        /** TypingEvent toNodeId */
        toNodeId?: (string|null);

        /** TypingEvent timestamp */
        timestamp?: (number|Long|null);
    }

    /** Represents a TypingEvent. */
    class TypingEvent implements ITypingEvent {

        /**
         * Constructs a new TypingEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.ITypingEvent);

        /** TypingEvent fromNodeId. */
        public fromNodeId: string;

        /** TypingEvent toNodeId. */
        public toNodeId: string;

        /** TypingEvent timestamp. */
        public timestamp: (number|Long);

        /**
         * Creates a new TypingEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TypingEvent instance
         */
        public static create(properties?: omnora.ITypingEvent): omnora.TypingEvent;

        /**
         * Encodes the specified TypingEvent message. Does not implicitly {@link omnora.TypingEvent.verify|verify} messages.
         * @param message TypingEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.ITypingEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TypingEvent message, length delimited. Does not implicitly {@link omnora.TypingEvent.verify|verify} messages.
         * @param message TypingEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.ITypingEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TypingEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TypingEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.TypingEvent;

        /**
         * Decodes a TypingEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TypingEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.TypingEvent;

        /**
         * Verifies a TypingEvent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TypingEvent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TypingEvent
         */
        public static fromObject(object: { [k: string]: any }): omnora.TypingEvent;

        /**
         * Creates a plain object from a TypingEvent message. Also converts values to other types if specified.
         * @param message TypingEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.TypingEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TypingEvent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a HubAck. */
    interface IHubAck {

        /** HubAck packetId */
        packetId?: (string|null);

        /** HubAck status */
        status?: (string|null);

        /** HubAck syncOffsetMs */
        syncOffsetMs?: (number|null);

        /** HubAck timestamp */
        timestamp?: (number|Long|null);

        /** HubAck activeProfile */
        activeProfile?: (string|null);
    }

    /** Represents a HubAck. */
    class HubAck implements IHubAck {

        /**
         * Constructs a new HubAck.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IHubAck);

        /** HubAck packetId. */
        public packetId: string;

        /** HubAck status. */
        public status: string;

        /** HubAck syncOffsetMs. */
        public syncOffsetMs: number;

        /** HubAck timestamp. */
        public timestamp: (number|Long);

        /** HubAck activeProfile. */
        public activeProfile: string;

        /**
         * Creates a new HubAck instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HubAck instance
         */
        public static create(properties?: omnora.IHubAck): omnora.HubAck;

        /**
         * Encodes the specified HubAck message. Does not implicitly {@link omnora.HubAck.verify|verify} messages.
         * @param message HubAck message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IHubAck, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified HubAck message, length delimited. Does not implicitly {@link omnora.HubAck.verify|verify} messages.
         * @param message HubAck message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IHubAck, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a HubAck message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HubAck
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.HubAck;

        /**
         * Decodes a HubAck message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HubAck
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.HubAck;

        /**
         * Verifies a HubAck message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a HubAck message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HubAck
         */
        public static fromObject(object: { [k: string]: any }): omnora.HubAck;

        /**
         * Creates a plain object from a HubAck message. Also converts values to other types if specified.
         * @param message HubAck
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.HubAck, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this HubAck to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a FetchPendingMessagesRequest. */
    interface IFetchPendingMessagesRequest {

        /** FetchPendingMessagesRequest nodeId */
        nodeId?: (string|null);

        /** FetchPendingMessagesRequest lastReceivedAt */
        lastReceivedAt?: (number|Long|null);
    }

    /** Represents a FetchPendingMessagesRequest. */
    class FetchPendingMessagesRequest implements IFetchPendingMessagesRequest {

        /**
         * Constructs a new FetchPendingMessagesRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IFetchPendingMessagesRequest);

        /** FetchPendingMessagesRequest nodeId. */
        public nodeId: string;

        /** FetchPendingMessagesRequest lastReceivedAt. */
        public lastReceivedAt: (number|Long);

        /**
         * Creates a new FetchPendingMessagesRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FetchPendingMessagesRequest instance
         */
        public static create(properties?: omnora.IFetchPendingMessagesRequest): omnora.FetchPendingMessagesRequest;

        /**
         * Encodes the specified FetchPendingMessagesRequest message. Does not implicitly {@link omnora.FetchPendingMessagesRequest.verify|verify} messages.
         * @param message FetchPendingMessagesRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IFetchPendingMessagesRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FetchPendingMessagesRequest message, length delimited. Does not implicitly {@link omnora.FetchPendingMessagesRequest.verify|verify} messages.
         * @param message FetchPendingMessagesRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IFetchPendingMessagesRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FetchPendingMessagesRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FetchPendingMessagesRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.FetchPendingMessagesRequest;

        /**
         * Decodes a FetchPendingMessagesRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FetchPendingMessagesRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.FetchPendingMessagesRequest;

        /**
         * Verifies a FetchPendingMessagesRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FetchPendingMessagesRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FetchPendingMessagesRequest
         */
        public static fromObject(object: { [k: string]: any }): omnora.FetchPendingMessagesRequest;

        /**
         * Creates a plain object from a FetchPendingMessagesRequest message. Also converts values to other types if specified.
         * @param message FetchPendingMessagesRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.FetchPendingMessagesRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FetchPendingMessagesRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ProfileManifest. */
    interface IProfileManifest {

        /** ProfileManifest activeProfile */
        activeProfile?: (string|null);

        /** ProfileManifest visibleModules */
        visibleModules?: (string[]|null);

        /** ProfileManifest labelOverrides */
        labelOverrides?: ({ [k: string]: string }|null);
    }

    /** Represents a ProfileManifest. */
    class ProfileManifest implements IProfileManifest {

        /**
         * Constructs a new ProfileManifest.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IProfileManifest);

        /** ProfileManifest activeProfile. */
        public activeProfile: string;

        /** ProfileManifest visibleModules. */
        public visibleModules: string[];

        /** ProfileManifest labelOverrides. */
        public labelOverrides: { [k: string]: string };

        /**
         * Creates a new ProfileManifest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ProfileManifest instance
         */
        public static create(properties?: omnora.IProfileManifest): omnora.ProfileManifest;

        /**
         * Encodes the specified ProfileManifest message. Does not implicitly {@link omnora.ProfileManifest.verify|verify} messages.
         * @param message ProfileManifest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IProfileManifest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ProfileManifest message, length delimited. Does not implicitly {@link omnora.ProfileManifest.verify|verify} messages.
         * @param message ProfileManifest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IProfileManifest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ProfileManifest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ProfileManifest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.ProfileManifest;

        /**
         * Decodes a ProfileManifest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ProfileManifest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.ProfileManifest;

        /**
         * Verifies a ProfileManifest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ProfileManifest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ProfileManifest
         */
        public static fromObject(object: { [k: string]: any }): omnora.ProfileManifest;

        /**
         * Creates a plain object from a ProfileManifest message. Also converts values to other types if specified.
         * @param message ProfileManifest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.ProfileManifest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ProfileManifest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a StockLookupRequest. */
    interface IStockLookupRequest {

        /** StockLookupRequest barcode */
        barcode?: (string|null);

        /** StockLookupRequest nodeId */
        nodeId?: (string|null);
    }

    /** Represents a StockLookupRequest. */
    class StockLookupRequest implements IStockLookupRequest {

        /**
         * Constructs a new StockLookupRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IStockLookupRequest);

        /** StockLookupRequest barcode. */
        public barcode: string;

        /** StockLookupRequest nodeId. */
        public nodeId: string;

        /**
         * Creates a new StockLookupRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns StockLookupRequest instance
         */
        public static create(properties?: omnora.IStockLookupRequest): omnora.StockLookupRequest;

        /**
         * Encodes the specified StockLookupRequest message. Does not implicitly {@link omnora.StockLookupRequest.verify|verify} messages.
         * @param message StockLookupRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IStockLookupRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified StockLookupRequest message, length delimited. Does not implicitly {@link omnora.StockLookupRequest.verify|verify} messages.
         * @param message StockLookupRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IStockLookupRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a StockLookupRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns StockLookupRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.StockLookupRequest;

        /**
         * Decodes a StockLookupRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns StockLookupRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.StockLookupRequest;

        /**
         * Verifies a StockLookupRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a StockLookupRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns StockLookupRequest
         */
        public static fromObject(object: { [k: string]: any }): omnora.StockLookupRequest;

        /**
         * Creates a plain object from a StockLookupRequest message. Also converts values to other types if specified.
         * @param message StockLookupRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.StockLookupRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this StockLookupRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a StockLookupResponse. */
    interface IStockLookupResponse {

        /** StockLookupResponse skuId */
        skuId?: (string|null);

        /** StockLookupResponse skuCode */
        skuCode?: (string|null);

        /** StockLookupResponse name */
        name?: (string|null);

        /** StockLookupResponse qtyOnHand */
        qtyOnHand?: (string|null);

        /** StockLookupResponse unit */
        unit?: (string|null);

        /** StockLookupResponse costPrice */
        costPrice?: (string|null);

        /** StockLookupResponse salePrice */
        salePrice?: (string|null);

        /** StockLookupResponse location */
        location?: (string|null);
    }

    /** Represents a StockLookupResponse. */
    class StockLookupResponse implements IStockLookupResponse {

        /**
         * Constructs a new StockLookupResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IStockLookupResponse);

        /** StockLookupResponse skuId. */
        public skuId: string;

        /** StockLookupResponse skuCode. */
        public skuCode: string;

        /** StockLookupResponse name. */
        public name: string;

        /** StockLookupResponse qtyOnHand. */
        public qtyOnHand: string;

        /** StockLookupResponse unit. */
        public unit: string;

        /** StockLookupResponse costPrice. */
        public costPrice: string;

        /** StockLookupResponse salePrice. */
        public salePrice: string;

        /** StockLookupResponse location. */
        public location: string;

        /**
         * Creates a new StockLookupResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns StockLookupResponse instance
         */
        public static create(properties?: omnora.IStockLookupResponse): omnora.StockLookupResponse;

        /**
         * Encodes the specified StockLookupResponse message. Does not implicitly {@link omnora.StockLookupResponse.verify|verify} messages.
         * @param message StockLookupResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IStockLookupResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified StockLookupResponse message, length delimited. Does not implicitly {@link omnora.StockLookupResponse.verify|verify} messages.
         * @param message StockLookupResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IStockLookupResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a StockLookupResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns StockLookupResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.StockLookupResponse;

        /**
         * Decodes a StockLookupResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns StockLookupResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.StockLookupResponse;

        /**
         * Verifies a StockLookupResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a StockLookupResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns StockLookupResponse
         */
        public static fromObject(object: { [k: string]: any }): omnora.StockLookupResponse;

        /**
         * Creates a plain object from a StockLookupResponse message. Also converts values to other types if specified.
         * @param message StockLookupResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.StockLookupResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this StockLookupResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ReadReceipt. */
    interface IReadReceipt {

        /** ReadReceipt messageId */
        messageId?: (string|null);

        /** ReadReceipt fromNodeId */
        fromNodeId?: (string|null);

        /** ReadReceipt readAt */
        readAt?: (number|Long|null);
    }

    /** Represents a ReadReceipt. */
    class ReadReceipt implements IReadReceipt {

        /**
         * Constructs a new ReadReceipt.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IReadReceipt);

        /** ReadReceipt messageId. */
        public messageId: string;

        /** ReadReceipt fromNodeId. */
        public fromNodeId: string;

        /** ReadReceipt readAt. */
        public readAt: (number|Long);

        /**
         * Creates a new ReadReceipt instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ReadReceipt instance
         */
        public static create(properties?: omnora.IReadReceipt): omnora.ReadReceipt;

        /**
         * Encodes the specified ReadReceipt message. Does not implicitly {@link omnora.ReadReceipt.verify|verify} messages.
         * @param message ReadReceipt message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IReadReceipt, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ReadReceipt message, length delimited. Does not implicitly {@link omnora.ReadReceipt.verify|verify} messages.
         * @param message ReadReceipt message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IReadReceipt, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ReadReceipt message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ReadReceipt
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.ReadReceipt;

        /**
         * Decodes a ReadReceipt message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ReadReceipt
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.ReadReceipt;

        /**
         * Verifies a ReadReceipt message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ReadReceipt message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ReadReceipt
         */
        public static fromObject(object: { [k: string]: any }): omnora.ReadReceipt;

        /**
         * Creates a plain object from a ReadReceipt message. Also converts values to other types if specified.
         * @param message ReadReceipt
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.ReadReceipt, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ReadReceipt to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PresenceUpdate. */
    interface IPresenceUpdate {

        /** PresenceUpdate nodeId */
        nodeId?: (string|null);

        /** PresenceUpdate status */
        status?: (string|null);

        /** PresenceUpdate timestamp */
        timestamp?: (number|Long|null);
    }

    /** Represents a PresenceUpdate. */
    class PresenceUpdate implements IPresenceUpdate {

        /**
         * Constructs a new PresenceUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: omnora.IPresenceUpdate);

        /** PresenceUpdate nodeId. */
        public nodeId: string;

        /** PresenceUpdate status. */
        public status: string;

        /** PresenceUpdate timestamp. */
        public timestamp: (number|Long);

        /**
         * Creates a new PresenceUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PresenceUpdate instance
         */
        public static create(properties?: omnora.IPresenceUpdate): omnora.PresenceUpdate;

        /**
         * Encodes the specified PresenceUpdate message. Does not implicitly {@link omnora.PresenceUpdate.verify|verify} messages.
         * @param message PresenceUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: omnora.IPresenceUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PresenceUpdate message, length delimited. Does not implicitly {@link omnora.PresenceUpdate.verify|verify} messages.
         * @param message PresenceUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: omnora.IPresenceUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PresenceUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PresenceUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): omnora.PresenceUpdate;

        /**
         * Decodes a PresenceUpdate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PresenceUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): omnora.PresenceUpdate;

        /**
         * Verifies a PresenceUpdate message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PresenceUpdate message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PresenceUpdate
         */
        public static fromObject(object: { [k: string]: any }): omnora.PresenceUpdate;

        /**
         * Creates a plain object from a PresenceUpdate message. Also converts values to other types if specified.
         * @param message PresenceUpdate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: omnora.PresenceUpdate, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PresenceUpdate to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
