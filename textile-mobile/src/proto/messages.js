/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.omnora = (function() {

    /**
     * Namespace omnora.
     * @exports omnora
     * @namespace
     */
    var omnora = {};

    omnora.Packet = (function() {

        /**
         * Properties of a Packet.
         * @memberof omnora
         * @interface IPacket
         * @property {string|null} [packetId] Packet packetId
         * @property {string|null} [nodeId] Packet nodeId
         * @property {number|Long|null} [timestamp] Packet timestamp
         * @property {omnora.IScanEvent|null} [scan] Packet scan
         * @property {omnora.IHeartbeatEvent|null} [heartbeat] Packet heartbeat
         * @property {omnora.ISOSEvent|null} [sos] Packet sos
         * @property {omnora.IErrorEvent|null} [error] Packet error
         * @property {omnora.ITelemetryEvent|null} [telemetry] Packet telemetry
         * @property {omnora.IKhataEntry|null} [khata] Packet khata
         * @property {omnora.IStockDelta|null} [stock] Packet stock
         * @property {omnora.ITacticalMessage|null} [message] Packet message
         * @property {omnora.IHubAck|null} [ack] Packet ack
         * @property {omnora.ITypingEvent|null} [typing] Packet typing
         * @property {omnora.IFetchPendingMessagesRequest|null} [fetchPending] Packet fetchPending
         * @property {omnora.IProfileManifest|null} [profileManifest] Packet profileManifest
         * @property {omnora.INspEnvelope|null} [nsp] Packet nsp
         */

        /**
         * Constructs a new Packet.
         * @memberof omnora
         * @classdesc GLOBAL PACKET ENVELOPE
         * @implements IPacket
         * @constructor
         * @param {omnora.IPacket=} [properties] Properties to set
         */
        function Packet(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Packet packetId.
         * @member {string} packetId
         * @memberof omnora.Packet
         * @instance
         */
        Packet.prototype.packetId = "";

        /**
         * Packet nodeId.
         * @member {string} nodeId
         * @memberof omnora.Packet
         * @instance
         */
        Packet.prototype.nodeId = "";

        /**
         * Packet timestamp.
         * @member {number|Long} timestamp
         * @memberof omnora.Packet
         * @instance
         */
        Packet.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Packet scan.
         * @member {omnora.IScanEvent|null|undefined} scan
         * @memberof omnora.Packet
         * @instance
         */
        Packet.prototype.scan = null;

        /**
         * Packet heartbeat.
         * @member {omnora.IHeartbeatEvent|null|undefined} heartbeat
         * @memberof omnora.Packet
         * @instance
         */
        Packet.prototype.heartbeat = null;

        /**
         * Packet sos.
         * @member {omnora.ISOSEvent|null|undefined} sos
         * @memberof omnora.Packet
         * @instance
         */
        Packet.prototype.sos = null;

        /**
         * Packet error.
         * @member {omnora.IErrorEvent|null|undefined} error
         * @memberof omnora.Packet
         * @instance
         */
        Packet.prototype.error = null;

        /**
         * Packet telemetry.
         * @member {omnora.ITelemetryEvent|null|undefined} telemetry
         * @memberof omnora.Packet
         * @instance
         */
        Packet.prototype.telemetry = null;

        /**
         * Packet khata.
         * @member {omnora.IKhataEntry|null|undefined} khata
         * @memberof omnora.Packet
         * @instance
         */
        Packet.prototype.khata = null;

        /**
         * Packet stock.
         * @member {omnora.IStockDelta|null|undefined} stock
         * @memberof omnora.Packet
         * @instance
         */
        Packet.prototype.stock = null;

        /**
         * Packet message.
         * @member {omnora.ITacticalMessage|null|undefined} message
         * @memberof omnora.Packet
         * @instance
         */
        Packet.prototype.message = null;

        /**
         * Packet ack.
         * @member {omnora.IHubAck|null|undefined} ack
         * @memberof omnora.Packet
         * @instance
         */
        Packet.prototype.ack = null;

        /**
         * Packet typing.
         * @member {omnora.ITypingEvent|null|undefined} typing
         * @memberof omnora.Packet
         * @instance
         */
        Packet.prototype.typing = null;

        /**
         * Packet fetchPending.
         * @member {omnora.IFetchPendingMessagesRequest|null|undefined} fetchPending
         * @memberof omnora.Packet
         * @instance
         */
        Packet.prototype.fetchPending = null;

        /**
         * Packet profileManifest.
         * @member {omnora.IProfileManifest|null|undefined} profileManifest
         * @memberof omnora.Packet
         * @instance
         */
        Packet.prototype.profileManifest = null;

        /**
         * Packet nsp.
         * @member {omnora.INspEnvelope|null|undefined} nsp
         * @memberof omnora.Packet
         * @instance
         */
        Packet.prototype.nsp = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * Packet event.
         * @member {"scan"|"heartbeat"|"sos"|"error"|"telemetry"|"khata"|"stock"|"message"|"ack"|"typing"|"fetchPending"|"profileManifest"|"nsp"|undefined} event
         * @memberof omnora.Packet
         * @instance
         */
        Object.defineProperty(Packet.prototype, "event", {
            get: $util.oneOfGetter($oneOfFields = ["scan", "heartbeat", "sos", "error", "telemetry", "khata", "stock", "message", "ack", "typing", "fetchPending", "profileManifest", "nsp"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new Packet instance using the specified properties.
         * @function create
         * @memberof omnora.Packet
         * @static
         * @param {omnora.IPacket=} [properties] Properties to set
         * @returns {omnora.Packet} Packet instance
         */
        Packet.create = function create(properties) {
            return new Packet(properties);
        };

        /**
         * Encodes the specified Packet message. Does not implicitly {@link omnora.Packet.verify|verify} messages.
         * @function encode
         * @memberof omnora.Packet
         * @static
         * @param {omnora.IPacket} message Packet message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Packet.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.packetId != null && Object.hasOwnProperty.call(message, "packetId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.packetId);
            if (message.nodeId != null && Object.hasOwnProperty.call(message, "nodeId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.nodeId);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.timestamp);
            if (message.scan != null && Object.hasOwnProperty.call(message, "scan"))
                $root.omnora.ScanEvent.encode(message.scan, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.heartbeat != null && Object.hasOwnProperty.call(message, "heartbeat"))
                $root.omnora.HeartbeatEvent.encode(message.heartbeat, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.sos != null && Object.hasOwnProperty.call(message, "sos"))
                $root.omnora.SOSEvent.encode(message.sos, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                $root.omnora.ErrorEvent.encode(message.error, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.telemetry != null && Object.hasOwnProperty.call(message, "telemetry"))
                $root.omnora.TelemetryEvent.encode(message.telemetry, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.khata != null && Object.hasOwnProperty.call(message, "khata"))
                $root.omnora.KhataEntry.encode(message.khata, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
            if (message.stock != null && Object.hasOwnProperty.call(message, "stock"))
                $root.omnora.StockDelta.encode(message.stock, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                $root.omnora.TacticalMessage.encode(message.message, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            if (message.ack != null && Object.hasOwnProperty.call(message, "ack"))
                $root.omnora.HubAck.encode(message.ack, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
            if (message.typing != null && Object.hasOwnProperty.call(message, "typing"))
                $root.omnora.TypingEvent.encode(message.typing, writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
            if (message.fetchPending != null && Object.hasOwnProperty.call(message, "fetchPending"))
                $root.omnora.FetchPendingMessagesRequest.encode(message.fetchPending, writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
            if (message.profileManifest != null && Object.hasOwnProperty.call(message, "profileManifest"))
                $root.omnora.ProfileManifest.encode(message.profileManifest, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
            if (message.nsp != null && Object.hasOwnProperty.call(message, "nsp"))
                $root.omnora.NspEnvelope.encode(message.nsp, writer.uint32(/* id 16, wireType 2 =*/130).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Packet message, length delimited. Does not implicitly {@link omnora.Packet.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.Packet
         * @static
         * @param {omnora.IPacket} message Packet message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Packet.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Packet message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.Packet
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.Packet} Packet
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Packet.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.Packet();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.packetId = reader.string();
                    break;
                case 2:
                    message.nodeId = reader.string();
                    break;
                case 3:
                    message.timestamp = reader.int64();
                    break;
                case 4:
                    message.scan = $root.omnora.ScanEvent.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.heartbeat = $root.omnora.HeartbeatEvent.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.sos = $root.omnora.SOSEvent.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.error = $root.omnora.ErrorEvent.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.telemetry = $root.omnora.TelemetryEvent.decode(reader, reader.uint32());
                    break;
                case 9:
                    message.khata = $root.omnora.KhataEntry.decode(reader, reader.uint32());
                    break;
                case 10:
                    message.stock = $root.omnora.StockDelta.decode(reader, reader.uint32());
                    break;
                case 11:
                    message.message = $root.omnora.TacticalMessage.decode(reader, reader.uint32());
                    break;
                case 12:
                    message.ack = $root.omnora.HubAck.decode(reader, reader.uint32());
                    break;
                case 13:
                    message.typing = $root.omnora.TypingEvent.decode(reader, reader.uint32());
                    break;
                case 14:
                    message.fetchPending = $root.omnora.FetchPendingMessagesRequest.decode(reader, reader.uint32());
                    break;
                case 15:
                    message.profileManifest = $root.omnora.ProfileManifest.decode(reader, reader.uint32());
                    break;
                case 16:
                    message.nsp = $root.omnora.NspEnvelope.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Packet message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.Packet
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.Packet} Packet
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Packet.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Packet message.
         * @function verify
         * @memberof omnora.Packet
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Packet.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.packetId != null && message.hasOwnProperty("packetId"))
                if (!$util.isString(message.packetId))
                    return "packetId: string expected";
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                if (!$util.isString(message.nodeId))
                    return "nodeId: string expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.scan != null && message.hasOwnProperty("scan")) {
                properties.event = 1;
                {
                    var error = $root.omnora.ScanEvent.verify(message.scan);
                    if (error)
                        return "scan." + error;
                }
            }
            if (message.heartbeat != null && message.hasOwnProperty("heartbeat")) {
                if (properties.event === 1)
                    return "event: multiple values";
                properties.event = 1;
                {
                    var error = $root.omnora.HeartbeatEvent.verify(message.heartbeat);
                    if (error)
                        return "heartbeat." + error;
                }
            }
            if (message.sos != null && message.hasOwnProperty("sos")) {
                if (properties.event === 1)
                    return "event: multiple values";
                properties.event = 1;
                {
                    var error = $root.omnora.SOSEvent.verify(message.sos);
                    if (error)
                        return "sos." + error;
                }
            }
            if (message.error != null && message.hasOwnProperty("error")) {
                if (properties.event === 1)
                    return "event: multiple values";
                properties.event = 1;
                {
                    var error = $root.omnora.ErrorEvent.verify(message.error);
                    if (error)
                        return "error." + error;
                }
            }
            if (message.telemetry != null && message.hasOwnProperty("telemetry")) {
                if (properties.event === 1)
                    return "event: multiple values";
                properties.event = 1;
                {
                    var error = $root.omnora.TelemetryEvent.verify(message.telemetry);
                    if (error)
                        return "telemetry." + error;
                }
            }
            if (message.khata != null && message.hasOwnProperty("khata")) {
                if (properties.event === 1)
                    return "event: multiple values";
                properties.event = 1;
                {
                    var error = $root.omnora.KhataEntry.verify(message.khata);
                    if (error)
                        return "khata." + error;
                }
            }
            if (message.stock != null && message.hasOwnProperty("stock")) {
                if (properties.event === 1)
                    return "event: multiple values";
                properties.event = 1;
                {
                    var error = $root.omnora.StockDelta.verify(message.stock);
                    if (error)
                        return "stock." + error;
                }
            }
            if (message.message != null && message.hasOwnProperty("message")) {
                if (properties.event === 1)
                    return "event: multiple values";
                properties.event = 1;
                {
                    var error = $root.omnora.TacticalMessage.verify(message.message);
                    if (error)
                        return "message." + error;
                }
            }
            if (message.ack != null && message.hasOwnProperty("ack")) {
                if (properties.event === 1)
                    return "event: multiple values";
                properties.event = 1;
                {
                    var error = $root.omnora.HubAck.verify(message.ack);
                    if (error)
                        return "ack." + error;
                }
            }
            if (message.typing != null && message.hasOwnProperty("typing")) {
                if (properties.event === 1)
                    return "event: multiple values";
                properties.event = 1;
                {
                    var error = $root.omnora.TypingEvent.verify(message.typing);
                    if (error)
                        return "typing." + error;
                }
            }
            if (message.fetchPending != null && message.hasOwnProperty("fetchPending")) {
                if (properties.event === 1)
                    return "event: multiple values";
                properties.event = 1;
                {
                    var error = $root.omnora.FetchPendingMessagesRequest.verify(message.fetchPending);
                    if (error)
                        return "fetchPending." + error;
                }
            }
            if (message.profileManifest != null && message.hasOwnProperty("profileManifest")) {
                if (properties.event === 1)
                    return "event: multiple values";
                properties.event = 1;
                {
                    var error = $root.omnora.ProfileManifest.verify(message.profileManifest);
                    if (error)
                        return "profileManifest." + error;
                }
            }
            if (message.nsp != null && message.hasOwnProperty("nsp")) {
                if (properties.event === 1)
                    return "event: multiple values";
                properties.event = 1;
                {
                    var error = $root.omnora.NspEnvelope.verify(message.nsp);
                    if (error)
                        return "nsp." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Packet message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.Packet
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.Packet} Packet
         */
        Packet.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.Packet)
                return object;
            var message = new $root.omnora.Packet();
            if (object.packetId != null)
                message.packetId = String(object.packetId);
            if (object.nodeId != null)
                message.nodeId = String(object.nodeId);
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            if (object.scan != null) {
                if (typeof object.scan !== "object")
                    throw TypeError(".omnora.Packet.scan: object expected");
                message.scan = $root.omnora.ScanEvent.fromObject(object.scan);
            }
            if (object.heartbeat != null) {
                if (typeof object.heartbeat !== "object")
                    throw TypeError(".omnora.Packet.heartbeat: object expected");
                message.heartbeat = $root.omnora.HeartbeatEvent.fromObject(object.heartbeat);
            }
            if (object.sos != null) {
                if (typeof object.sos !== "object")
                    throw TypeError(".omnora.Packet.sos: object expected");
                message.sos = $root.omnora.SOSEvent.fromObject(object.sos);
            }
            if (object.error != null) {
                if (typeof object.error !== "object")
                    throw TypeError(".omnora.Packet.error: object expected");
                message.error = $root.omnora.ErrorEvent.fromObject(object.error);
            }
            if (object.telemetry != null) {
                if (typeof object.telemetry !== "object")
                    throw TypeError(".omnora.Packet.telemetry: object expected");
                message.telemetry = $root.omnora.TelemetryEvent.fromObject(object.telemetry);
            }
            if (object.khata != null) {
                if (typeof object.khata !== "object")
                    throw TypeError(".omnora.Packet.khata: object expected");
                message.khata = $root.omnora.KhataEntry.fromObject(object.khata);
            }
            if (object.stock != null) {
                if (typeof object.stock !== "object")
                    throw TypeError(".omnora.Packet.stock: object expected");
                message.stock = $root.omnora.StockDelta.fromObject(object.stock);
            }
            if (object.message != null) {
                if (typeof object.message !== "object")
                    throw TypeError(".omnora.Packet.message: object expected");
                message.message = $root.omnora.TacticalMessage.fromObject(object.message);
            }
            if (object.ack != null) {
                if (typeof object.ack !== "object")
                    throw TypeError(".omnora.Packet.ack: object expected");
                message.ack = $root.omnora.HubAck.fromObject(object.ack);
            }
            if (object.typing != null) {
                if (typeof object.typing !== "object")
                    throw TypeError(".omnora.Packet.typing: object expected");
                message.typing = $root.omnora.TypingEvent.fromObject(object.typing);
            }
            if (object.fetchPending != null) {
                if (typeof object.fetchPending !== "object")
                    throw TypeError(".omnora.Packet.fetchPending: object expected");
                message.fetchPending = $root.omnora.FetchPendingMessagesRequest.fromObject(object.fetchPending);
            }
            if (object.profileManifest != null) {
                if (typeof object.profileManifest !== "object")
                    throw TypeError(".omnora.Packet.profileManifest: object expected");
                message.profileManifest = $root.omnora.ProfileManifest.fromObject(object.profileManifest);
            }
            if (object.nsp != null) {
                if (typeof object.nsp !== "object")
                    throw TypeError(".omnora.Packet.nsp: object expected");
                message.nsp = $root.omnora.NspEnvelope.fromObject(object.nsp);
            }
            return message;
        };

        /**
         * Creates a plain object from a Packet message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.Packet
         * @static
         * @param {omnora.Packet} message Packet
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Packet.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.packetId = "";
                object.nodeId = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
            }
            if (message.packetId != null && message.hasOwnProperty("packetId"))
                object.packetId = message.packetId;
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                object.nodeId = message.nodeId;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            if (message.scan != null && message.hasOwnProperty("scan")) {
                object.scan = $root.omnora.ScanEvent.toObject(message.scan, options);
                if (options.oneofs)
                    object.event = "scan";
            }
            if (message.heartbeat != null && message.hasOwnProperty("heartbeat")) {
                object.heartbeat = $root.omnora.HeartbeatEvent.toObject(message.heartbeat, options);
                if (options.oneofs)
                    object.event = "heartbeat";
            }
            if (message.sos != null && message.hasOwnProperty("sos")) {
                object.sos = $root.omnora.SOSEvent.toObject(message.sos, options);
                if (options.oneofs)
                    object.event = "sos";
            }
            if (message.error != null && message.hasOwnProperty("error")) {
                object.error = $root.omnora.ErrorEvent.toObject(message.error, options);
                if (options.oneofs)
                    object.event = "error";
            }
            if (message.telemetry != null && message.hasOwnProperty("telemetry")) {
                object.telemetry = $root.omnora.TelemetryEvent.toObject(message.telemetry, options);
                if (options.oneofs)
                    object.event = "telemetry";
            }
            if (message.khata != null && message.hasOwnProperty("khata")) {
                object.khata = $root.omnora.KhataEntry.toObject(message.khata, options);
                if (options.oneofs)
                    object.event = "khata";
            }
            if (message.stock != null && message.hasOwnProperty("stock")) {
                object.stock = $root.omnora.StockDelta.toObject(message.stock, options);
                if (options.oneofs)
                    object.event = "stock";
            }
            if (message.message != null && message.hasOwnProperty("message")) {
                object.message = $root.omnora.TacticalMessage.toObject(message.message, options);
                if (options.oneofs)
                    object.event = "message";
            }
            if (message.ack != null && message.hasOwnProperty("ack")) {
                object.ack = $root.omnora.HubAck.toObject(message.ack, options);
                if (options.oneofs)
                    object.event = "ack";
            }
            if (message.typing != null && message.hasOwnProperty("typing")) {
                object.typing = $root.omnora.TypingEvent.toObject(message.typing, options);
                if (options.oneofs)
                    object.event = "typing";
            }
            if (message.fetchPending != null && message.hasOwnProperty("fetchPending")) {
                object.fetchPending = $root.omnora.FetchPendingMessagesRequest.toObject(message.fetchPending, options);
                if (options.oneofs)
                    object.event = "fetchPending";
            }
            if (message.profileManifest != null && message.hasOwnProperty("profileManifest")) {
                object.profileManifest = $root.omnora.ProfileManifest.toObject(message.profileManifest, options);
                if (options.oneofs)
                    object.event = "profileManifest";
            }
            if (message.nsp != null && message.hasOwnProperty("nsp")) {
                object.nsp = $root.omnora.NspEnvelope.toObject(message.nsp, options);
                if (options.oneofs)
                    object.event = "nsp";
            }
            return object;
        };

        /**
         * Converts this Packet to JSON.
         * @function toJSON
         * @memberof omnora.Packet
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Packet.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Packet;
    })();

    omnora.SentinelBreachEvent = (function() {

        /**
         * Properties of a SentinelBreachEvent.
         * @memberof omnora
         * @interface ISentinelBreachEvent
         * @property {string|null} [nodeId] SentinelBreachEvent nodeId
         * @property {string|null} [zoneId] SentinelBreachEvent zoneId
         * @property {string|null} [detectedClass] SentinelBreachEvent detectedClass
         * @property {number|null} [confidence] SentinelBreachEvent confidence
         * @property {number|Long|null} [timestamp] SentinelBreachEvent timestamp
         * @property {Uint8Array|null} [jpegFrame] SentinelBreachEvent jpegFrame
         */

        /**
         * Constructs a new SentinelBreachEvent.
         * @memberof omnora
         * @classdesc Represents a SentinelBreachEvent.
         * @implements ISentinelBreachEvent
         * @constructor
         * @param {omnora.ISentinelBreachEvent=} [properties] Properties to set
         */
        function SentinelBreachEvent(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SentinelBreachEvent nodeId.
         * @member {string} nodeId
         * @memberof omnora.SentinelBreachEvent
         * @instance
         */
        SentinelBreachEvent.prototype.nodeId = "";

        /**
         * SentinelBreachEvent zoneId.
         * @member {string} zoneId
         * @memberof omnora.SentinelBreachEvent
         * @instance
         */
        SentinelBreachEvent.prototype.zoneId = "";

        /**
         * SentinelBreachEvent detectedClass.
         * @member {string} detectedClass
         * @memberof omnora.SentinelBreachEvent
         * @instance
         */
        SentinelBreachEvent.prototype.detectedClass = "";

        /**
         * SentinelBreachEvent confidence.
         * @member {number} confidence
         * @memberof omnora.SentinelBreachEvent
         * @instance
         */
        SentinelBreachEvent.prototype.confidence = 0;

        /**
         * SentinelBreachEvent timestamp.
         * @member {number|Long} timestamp
         * @memberof omnora.SentinelBreachEvent
         * @instance
         */
        SentinelBreachEvent.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * SentinelBreachEvent jpegFrame.
         * @member {Uint8Array} jpegFrame
         * @memberof omnora.SentinelBreachEvent
         * @instance
         */
        SentinelBreachEvent.prototype.jpegFrame = $util.newBuffer([]);

        /**
         * Creates a new SentinelBreachEvent instance using the specified properties.
         * @function create
         * @memberof omnora.SentinelBreachEvent
         * @static
         * @param {omnora.ISentinelBreachEvent=} [properties] Properties to set
         * @returns {omnora.SentinelBreachEvent} SentinelBreachEvent instance
         */
        SentinelBreachEvent.create = function create(properties) {
            return new SentinelBreachEvent(properties);
        };

        /**
         * Encodes the specified SentinelBreachEvent message. Does not implicitly {@link omnora.SentinelBreachEvent.verify|verify} messages.
         * @function encode
         * @memberof omnora.SentinelBreachEvent
         * @static
         * @param {omnora.ISentinelBreachEvent} message SentinelBreachEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SentinelBreachEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nodeId != null && Object.hasOwnProperty.call(message, "nodeId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.nodeId);
            if (message.zoneId != null && Object.hasOwnProperty.call(message, "zoneId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.zoneId);
            if (message.detectedClass != null && Object.hasOwnProperty.call(message, "detectedClass"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.detectedClass);
            if (message.confidence != null && Object.hasOwnProperty.call(message, "confidence"))
                writer.uint32(/* id 4, wireType 5 =*/37).float(message.confidence);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 5, wireType 0 =*/40).int64(message.timestamp);
            if (message.jpegFrame != null && Object.hasOwnProperty.call(message, "jpegFrame"))
                writer.uint32(/* id 6, wireType 2 =*/50).bytes(message.jpegFrame);
            return writer;
        };

        /**
         * Encodes the specified SentinelBreachEvent message, length delimited. Does not implicitly {@link omnora.SentinelBreachEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.SentinelBreachEvent
         * @static
         * @param {omnora.ISentinelBreachEvent} message SentinelBreachEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SentinelBreachEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SentinelBreachEvent message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.SentinelBreachEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.SentinelBreachEvent} SentinelBreachEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SentinelBreachEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.SentinelBreachEvent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nodeId = reader.string();
                    break;
                case 2:
                    message.zoneId = reader.string();
                    break;
                case 3:
                    message.detectedClass = reader.string();
                    break;
                case 4:
                    message.confidence = reader.float();
                    break;
                case 5:
                    message.timestamp = reader.int64();
                    break;
                case 6:
                    message.jpegFrame = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SentinelBreachEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.SentinelBreachEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.SentinelBreachEvent} SentinelBreachEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SentinelBreachEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SentinelBreachEvent message.
         * @function verify
         * @memberof omnora.SentinelBreachEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SentinelBreachEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                if (!$util.isString(message.nodeId))
                    return "nodeId: string expected";
            if (message.zoneId != null && message.hasOwnProperty("zoneId"))
                if (!$util.isString(message.zoneId))
                    return "zoneId: string expected";
            if (message.detectedClass != null && message.hasOwnProperty("detectedClass"))
                if (!$util.isString(message.detectedClass))
                    return "detectedClass: string expected";
            if (message.confidence != null && message.hasOwnProperty("confidence"))
                if (typeof message.confidence !== "number")
                    return "confidence: number expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.jpegFrame != null && message.hasOwnProperty("jpegFrame"))
                if (!(message.jpegFrame && typeof message.jpegFrame.length === "number" || $util.isString(message.jpegFrame)))
                    return "jpegFrame: buffer expected";
            return null;
        };

        /**
         * Creates a SentinelBreachEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.SentinelBreachEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.SentinelBreachEvent} SentinelBreachEvent
         */
        SentinelBreachEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.SentinelBreachEvent)
                return object;
            var message = new $root.omnora.SentinelBreachEvent();
            if (object.nodeId != null)
                message.nodeId = String(object.nodeId);
            if (object.zoneId != null)
                message.zoneId = String(object.zoneId);
            if (object.detectedClass != null)
                message.detectedClass = String(object.detectedClass);
            if (object.confidence != null)
                message.confidence = Number(object.confidence);
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            if (object.jpegFrame != null)
                if (typeof object.jpegFrame === "string")
                    $util.base64.decode(object.jpegFrame, message.jpegFrame = $util.newBuffer($util.base64.length(object.jpegFrame)), 0);
                else if (object.jpegFrame.length)
                    message.jpegFrame = object.jpegFrame;
            return message;
        };

        /**
         * Creates a plain object from a SentinelBreachEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.SentinelBreachEvent
         * @static
         * @param {omnora.SentinelBreachEvent} message SentinelBreachEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SentinelBreachEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.nodeId = "";
                object.zoneId = "";
                object.detectedClass = "";
                object.confidence = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                if (options.bytes === String)
                    object.jpegFrame = "";
                else {
                    object.jpegFrame = [];
                    if (options.bytes !== Array)
                        object.jpegFrame = $util.newBuffer(object.jpegFrame);
                }
            }
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                object.nodeId = message.nodeId;
            if (message.zoneId != null && message.hasOwnProperty("zoneId"))
                object.zoneId = message.zoneId;
            if (message.detectedClass != null && message.hasOwnProperty("detectedClass"))
                object.detectedClass = message.detectedClass;
            if (message.confidence != null && message.hasOwnProperty("confidence"))
                object.confidence = options.json && !isFinite(message.confidence) ? String(message.confidence) : message.confidence;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            if (message.jpegFrame != null && message.hasOwnProperty("jpegFrame"))
                object.jpegFrame = options.bytes === String ? $util.base64.encode(message.jpegFrame, 0, message.jpegFrame.length) : options.bytes === Array ? Array.prototype.slice.call(message.jpegFrame) : message.jpegFrame;
            return object;
        };

        /**
         * Converts this SentinelBreachEvent to JSON.
         * @function toJSON
         * @memberof omnora.SentinelBreachEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SentinelBreachEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SentinelBreachEvent;
    })();

    omnora.SystemLockCommand = (function() {

        /**
         * Properties of a SystemLockCommand.
         * @memberof omnora
         * @interface ISystemLockCommand
         * @property {string|null} [issuedByNodeId] SystemLockCommand issuedByNodeId
         * @property {string|null} [reason] SystemLockCommand reason
         * @property {number|Long|null} [timestamp] SystemLockCommand timestamp
         * @property {boolean|null} [lock] SystemLockCommand lock
         */

        /**
         * Constructs a new SystemLockCommand.
         * @memberof omnora
         * @classdesc Represents a SystemLockCommand.
         * @implements ISystemLockCommand
         * @constructor
         * @param {omnora.ISystemLockCommand=} [properties] Properties to set
         */
        function SystemLockCommand(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SystemLockCommand issuedByNodeId.
         * @member {string} issuedByNodeId
         * @memberof omnora.SystemLockCommand
         * @instance
         */
        SystemLockCommand.prototype.issuedByNodeId = "";

        /**
         * SystemLockCommand reason.
         * @member {string} reason
         * @memberof omnora.SystemLockCommand
         * @instance
         */
        SystemLockCommand.prototype.reason = "";

        /**
         * SystemLockCommand timestamp.
         * @member {number|Long} timestamp
         * @memberof omnora.SystemLockCommand
         * @instance
         */
        SystemLockCommand.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * SystemLockCommand lock.
         * @member {boolean} lock
         * @memberof omnora.SystemLockCommand
         * @instance
         */
        SystemLockCommand.prototype.lock = false;

        /**
         * Creates a new SystemLockCommand instance using the specified properties.
         * @function create
         * @memberof omnora.SystemLockCommand
         * @static
         * @param {omnora.ISystemLockCommand=} [properties] Properties to set
         * @returns {omnora.SystemLockCommand} SystemLockCommand instance
         */
        SystemLockCommand.create = function create(properties) {
            return new SystemLockCommand(properties);
        };

        /**
         * Encodes the specified SystemLockCommand message. Does not implicitly {@link omnora.SystemLockCommand.verify|verify} messages.
         * @function encode
         * @memberof omnora.SystemLockCommand
         * @static
         * @param {omnora.ISystemLockCommand} message SystemLockCommand message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SystemLockCommand.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.issuedByNodeId != null && Object.hasOwnProperty.call(message, "issuedByNodeId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.issuedByNodeId);
            if (message.reason != null && Object.hasOwnProperty.call(message, "reason"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.reason);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.timestamp);
            if (message.lock != null && Object.hasOwnProperty.call(message, "lock"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.lock);
            return writer;
        };

        /**
         * Encodes the specified SystemLockCommand message, length delimited. Does not implicitly {@link omnora.SystemLockCommand.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.SystemLockCommand
         * @static
         * @param {omnora.ISystemLockCommand} message SystemLockCommand message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SystemLockCommand.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SystemLockCommand message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.SystemLockCommand
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.SystemLockCommand} SystemLockCommand
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SystemLockCommand.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.SystemLockCommand();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.issuedByNodeId = reader.string();
                    break;
                case 2:
                    message.reason = reader.string();
                    break;
                case 3:
                    message.timestamp = reader.int64();
                    break;
                case 4:
                    message.lock = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SystemLockCommand message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.SystemLockCommand
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.SystemLockCommand} SystemLockCommand
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SystemLockCommand.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SystemLockCommand message.
         * @function verify
         * @memberof omnora.SystemLockCommand
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SystemLockCommand.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.issuedByNodeId != null && message.hasOwnProperty("issuedByNodeId"))
                if (!$util.isString(message.issuedByNodeId))
                    return "issuedByNodeId: string expected";
            if (message.reason != null && message.hasOwnProperty("reason"))
                if (!$util.isString(message.reason))
                    return "reason: string expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.lock != null && message.hasOwnProperty("lock"))
                if (typeof message.lock !== "boolean")
                    return "lock: boolean expected";
            return null;
        };

        /**
         * Creates a SystemLockCommand message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.SystemLockCommand
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.SystemLockCommand} SystemLockCommand
         */
        SystemLockCommand.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.SystemLockCommand)
                return object;
            var message = new $root.omnora.SystemLockCommand();
            if (object.issuedByNodeId != null)
                message.issuedByNodeId = String(object.issuedByNodeId);
            if (object.reason != null)
                message.reason = String(object.reason);
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            if (object.lock != null)
                message.lock = Boolean(object.lock);
            return message;
        };

        /**
         * Creates a plain object from a SystemLockCommand message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.SystemLockCommand
         * @static
         * @param {omnora.SystemLockCommand} message SystemLockCommand
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SystemLockCommand.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.issuedByNodeId = "";
                object.reason = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                object.lock = false;
            }
            if (message.issuedByNodeId != null && message.hasOwnProperty("issuedByNodeId"))
                object.issuedByNodeId = message.issuedByNodeId;
            if (message.reason != null && message.hasOwnProperty("reason"))
                object.reason = message.reason;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            if (message.lock != null && message.hasOwnProperty("lock"))
                object.lock = message.lock;
            return object;
        };

        /**
         * Converts this SystemLockCommand to JSON.
         * @function toJSON
         * @memberof omnora.SystemLockCommand
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SystemLockCommand.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SystemLockCommand;
    })();

    omnora.GuardianAuthRequest = (function() {

        /**
         * Properties of a GuardianAuthRequest.
         * @memberof omnora
         * @interface IGuardianAuthRequest
         * @property {string|null} [requestId] GuardianAuthRequest requestId
         * @property {string|null} [hubAction] GuardianAuthRequest hubAction
         * @property {number|Long|null} [expiresAt] GuardianAuthRequest expiresAt
         * @property {number|Long|null} [timestamp] GuardianAuthRequest timestamp
         */

        /**
         * Constructs a new GuardianAuthRequest.
         * @memberof omnora
         * @classdesc Represents a GuardianAuthRequest.
         * @implements IGuardianAuthRequest
         * @constructor
         * @param {omnora.IGuardianAuthRequest=} [properties] Properties to set
         */
        function GuardianAuthRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GuardianAuthRequest requestId.
         * @member {string} requestId
         * @memberof omnora.GuardianAuthRequest
         * @instance
         */
        GuardianAuthRequest.prototype.requestId = "";

        /**
         * GuardianAuthRequest hubAction.
         * @member {string} hubAction
         * @memberof omnora.GuardianAuthRequest
         * @instance
         */
        GuardianAuthRequest.prototype.hubAction = "";

        /**
         * GuardianAuthRequest expiresAt.
         * @member {number|Long} expiresAt
         * @memberof omnora.GuardianAuthRequest
         * @instance
         */
        GuardianAuthRequest.prototype.expiresAt = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * GuardianAuthRequest timestamp.
         * @member {number|Long} timestamp
         * @memberof omnora.GuardianAuthRequest
         * @instance
         */
        GuardianAuthRequest.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new GuardianAuthRequest instance using the specified properties.
         * @function create
         * @memberof omnora.GuardianAuthRequest
         * @static
         * @param {omnora.IGuardianAuthRequest=} [properties] Properties to set
         * @returns {omnora.GuardianAuthRequest} GuardianAuthRequest instance
         */
        GuardianAuthRequest.create = function create(properties) {
            return new GuardianAuthRequest(properties);
        };

        /**
         * Encodes the specified GuardianAuthRequest message. Does not implicitly {@link omnora.GuardianAuthRequest.verify|verify} messages.
         * @function encode
         * @memberof omnora.GuardianAuthRequest
         * @static
         * @param {omnora.IGuardianAuthRequest} message GuardianAuthRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GuardianAuthRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.requestId != null && Object.hasOwnProperty.call(message, "requestId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.requestId);
            if (message.hubAction != null && Object.hasOwnProperty.call(message, "hubAction"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.hubAction);
            if (message.expiresAt != null && Object.hasOwnProperty.call(message, "expiresAt"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.expiresAt);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 4, wireType 0 =*/32).int64(message.timestamp);
            return writer;
        };

        /**
         * Encodes the specified GuardianAuthRequest message, length delimited. Does not implicitly {@link omnora.GuardianAuthRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.GuardianAuthRequest
         * @static
         * @param {omnora.IGuardianAuthRequest} message GuardianAuthRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GuardianAuthRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GuardianAuthRequest message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.GuardianAuthRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.GuardianAuthRequest} GuardianAuthRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GuardianAuthRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.GuardianAuthRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.requestId = reader.string();
                    break;
                case 2:
                    message.hubAction = reader.string();
                    break;
                case 3:
                    message.expiresAt = reader.int64();
                    break;
                case 4:
                    message.timestamp = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GuardianAuthRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.GuardianAuthRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.GuardianAuthRequest} GuardianAuthRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GuardianAuthRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GuardianAuthRequest message.
         * @function verify
         * @memberof omnora.GuardianAuthRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GuardianAuthRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.requestId != null && message.hasOwnProperty("requestId"))
                if (!$util.isString(message.requestId))
                    return "requestId: string expected";
            if (message.hubAction != null && message.hasOwnProperty("hubAction"))
                if (!$util.isString(message.hubAction))
                    return "hubAction: string expected";
            if (message.expiresAt != null && message.hasOwnProperty("expiresAt"))
                if (!$util.isInteger(message.expiresAt) && !(message.expiresAt && $util.isInteger(message.expiresAt.low) && $util.isInteger(message.expiresAt.high)))
                    return "expiresAt: integer|Long expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            return null;
        };

        /**
         * Creates a GuardianAuthRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.GuardianAuthRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.GuardianAuthRequest} GuardianAuthRequest
         */
        GuardianAuthRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.GuardianAuthRequest)
                return object;
            var message = new $root.omnora.GuardianAuthRequest();
            if (object.requestId != null)
                message.requestId = String(object.requestId);
            if (object.hubAction != null)
                message.hubAction = String(object.hubAction);
            if (object.expiresAt != null)
                if ($util.Long)
                    (message.expiresAt = $util.Long.fromValue(object.expiresAt)).unsigned = false;
                else if (typeof object.expiresAt === "string")
                    message.expiresAt = parseInt(object.expiresAt, 10);
                else if (typeof object.expiresAt === "number")
                    message.expiresAt = object.expiresAt;
                else if (typeof object.expiresAt === "object")
                    message.expiresAt = new $util.LongBits(object.expiresAt.low >>> 0, object.expiresAt.high >>> 0).toNumber();
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a GuardianAuthRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.GuardianAuthRequest
         * @static
         * @param {omnora.GuardianAuthRequest} message GuardianAuthRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GuardianAuthRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.requestId = "";
                object.hubAction = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.expiresAt = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.expiresAt = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
            }
            if (message.requestId != null && message.hasOwnProperty("requestId"))
                object.requestId = message.requestId;
            if (message.hubAction != null && message.hasOwnProperty("hubAction"))
                object.hubAction = message.hubAction;
            if (message.expiresAt != null && message.hasOwnProperty("expiresAt"))
                if (typeof message.expiresAt === "number")
                    object.expiresAt = options.longs === String ? String(message.expiresAt) : message.expiresAt;
                else
                    object.expiresAt = options.longs === String ? $util.Long.prototype.toString.call(message.expiresAt) : options.longs === Number ? new $util.LongBits(message.expiresAt.low >>> 0, message.expiresAt.high >>> 0).toNumber() : message.expiresAt;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            return object;
        };

        /**
         * Converts this GuardianAuthRequest to JSON.
         * @function toJSON
         * @memberof omnora.GuardianAuthRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GuardianAuthRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GuardianAuthRequest;
    })();

    omnora.GuardianAuthResponse = (function() {

        /**
         * Properties of a GuardianAuthResponse.
         * @memberof omnora
         * @interface IGuardianAuthResponse
         * @property {string|null} [requestId] GuardianAuthResponse requestId
         * @property {boolean|null} [approved] GuardianAuthResponse approved
         * @property {string|null} [nodeId] GuardianAuthResponse nodeId
         * @property {number|Long|null} [timestamp] GuardianAuthResponse timestamp
         * @property {string|null} [authToken] GuardianAuthResponse authToken
         */

        /**
         * Constructs a new GuardianAuthResponse.
         * @memberof omnora
         * @classdesc Represents a GuardianAuthResponse.
         * @implements IGuardianAuthResponse
         * @constructor
         * @param {omnora.IGuardianAuthResponse=} [properties] Properties to set
         */
        function GuardianAuthResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GuardianAuthResponse requestId.
         * @member {string} requestId
         * @memberof omnora.GuardianAuthResponse
         * @instance
         */
        GuardianAuthResponse.prototype.requestId = "";

        /**
         * GuardianAuthResponse approved.
         * @member {boolean} approved
         * @memberof omnora.GuardianAuthResponse
         * @instance
         */
        GuardianAuthResponse.prototype.approved = false;

        /**
         * GuardianAuthResponse nodeId.
         * @member {string} nodeId
         * @memberof omnora.GuardianAuthResponse
         * @instance
         */
        GuardianAuthResponse.prototype.nodeId = "";

        /**
         * GuardianAuthResponse timestamp.
         * @member {number|Long} timestamp
         * @memberof omnora.GuardianAuthResponse
         * @instance
         */
        GuardianAuthResponse.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * GuardianAuthResponse authToken.
         * @member {string} authToken
         * @memberof omnora.GuardianAuthResponse
         * @instance
         */
        GuardianAuthResponse.prototype.authToken = "";

        /**
         * Creates a new GuardianAuthResponse instance using the specified properties.
         * @function create
         * @memberof omnora.GuardianAuthResponse
         * @static
         * @param {omnora.IGuardianAuthResponse=} [properties] Properties to set
         * @returns {omnora.GuardianAuthResponse} GuardianAuthResponse instance
         */
        GuardianAuthResponse.create = function create(properties) {
            return new GuardianAuthResponse(properties);
        };

        /**
         * Encodes the specified GuardianAuthResponse message. Does not implicitly {@link omnora.GuardianAuthResponse.verify|verify} messages.
         * @function encode
         * @memberof omnora.GuardianAuthResponse
         * @static
         * @param {omnora.IGuardianAuthResponse} message GuardianAuthResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GuardianAuthResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.requestId != null && Object.hasOwnProperty.call(message, "requestId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.requestId);
            if (message.approved != null && Object.hasOwnProperty.call(message, "approved"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.approved);
            if (message.nodeId != null && Object.hasOwnProperty.call(message, "nodeId"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.nodeId);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 4, wireType 0 =*/32).int64(message.timestamp);
            if (message.authToken != null && Object.hasOwnProperty.call(message, "authToken"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.authToken);
            return writer;
        };

        /**
         * Encodes the specified GuardianAuthResponse message, length delimited. Does not implicitly {@link omnora.GuardianAuthResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.GuardianAuthResponse
         * @static
         * @param {omnora.IGuardianAuthResponse} message GuardianAuthResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GuardianAuthResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GuardianAuthResponse message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.GuardianAuthResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.GuardianAuthResponse} GuardianAuthResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GuardianAuthResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.GuardianAuthResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.requestId = reader.string();
                    break;
                case 2:
                    message.approved = reader.bool();
                    break;
                case 3:
                    message.nodeId = reader.string();
                    break;
                case 4:
                    message.timestamp = reader.int64();
                    break;
                case 5:
                    message.authToken = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GuardianAuthResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.GuardianAuthResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.GuardianAuthResponse} GuardianAuthResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GuardianAuthResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GuardianAuthResponse message.
         * @function verify
         * @memberof omnora.GuardianAuthResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GuardianAuthResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.requestId != null && message.hasOwnProperty("requestId"))
                if (!$util.isString(message.requestId))
                    return "requestId: string expected";
            if (message.approved != null && message.hasOwnProperty("approved"))
                if (typeof message.approved !== "boolean")
                    return "approved: boolean expected";
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                if (!$util.isString(message.nodeId))
                    return "nodeId: string expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.authToken != null && message.hasOwnProperty("authToken"))
                if (!$util.isString(message.authToken))
                    return "authToken: string expected";
            return null;
        };

        /**
         * Creates a GuardianAuthResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.GuardianAuthResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.GuardianAuthResponse} GuardianAuthResponse
         */
        GuardianAuthResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.GuardianAuthResponse)
                return object;
            var message = new $root.omnora.GuardianAuthResponse();
            if (object.requestId != null)
                message.requestId = String(object.requestId);
            if (object.approved != null)
                message.approved = Boolean(object.approved);
            if (object.nodeId != null)
                message.nodeId = String(object.nodeId);
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            if (object.authToken != null)
                message.authToken = String(object.authToken);
            return message;
        };

        /**
         * Creates a plain object from a GuardianAuthResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.GuardianAuthResponse
         * @static
         * @param {omnora.GuardianAuthResponse} message GuardianAuthResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GuardianAuthResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.requestId = "";
                object.approved = false;
                object.nodeId = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                object.authToken = "";
            }
            if (message.requestId != null && message.hasOwnProperty("requestId"))
                object.requestId = message.requestId;
            if (message.approved != null && message.hasOwnProperty("approved"))
                object.approved = message.approved;
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                object.nodeId = message.nodeId;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            if (message.authToken != null && message.hasOwnProperty("authToken"))
                object.authToken = message.authToken;
            return object;
        };

        /**
         * Converts this GuardianAuthResponse to JSON.
         * @function toJSON
         * @memberof omnora.GuardianAuthResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GuardianAuthResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GuardianAuthResponse;
    })();

    omnora.HeartbeatAlertEvent = (function() {

        /**
         * Properties of a HeartbeatAlertEvent.
         * @memberof omnora
         * @interface IHeartbeatAlertEvent
         * @property {string|null} [nodeId] HeartbeatAlertEvent nodeId
         * @property {string|null} [alertType] HeartbeatAlertEvent alertType
         * @property {number|Long|null} [timestamp] HeartbeatAlertEvent timestamp
         */

        /**
         * Constructs a new HeartbeatAlertEvent.
         * @memberof omnora
         * @classdesc Represents a HeartbeatAlertEvent.
         * @implements IHeartbeatAlertEvent
         * @constructor
         * @param {omnora.IHeartbeatAlertEvent=} [properties] Properties to set
         */
        function HeartbeatAlertEvent(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HeartbeatAlertEvent nodeId.
         * @member {string} nodeId
         * @memberof omnora.HeartbeatAlertEvent
         * @instance
         */
        HeartbeatAlertEvent.prototype.nodeId = "";

        /**
         * HeartbeatAlertEvent alertType.
         * @member {string} alertType
         * @memberof omnora.HeartbeatAlertEvent
         * @instance
         */
        HeartbeatAlertEvent.prototype.alertType = "";

        /**
         * HeartbeatAlertEvent timestamp.
         * @member {number|Long} timestamp
         * @memberof omnora.HeartbeatAlertEvent
         * @instance
         */
        HeartbeatAlertEvent.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new HeartbeatAlertEvent instance using the specified properties.
         * @function create
         * @memberof omnora.HeartbeatAlertEvent
         * @static
         * @param {omnora.IHeartbeatAlertEvent=} [properties] Properties to set
         * @returns {omnora.HeartbeatAlertEvent} HeartbeatAlertEvent instance
         */
        HeartbeatAlertEvent.create = function create(properties) {
            return new HeartbeatAlertEvent(properties);
        };

        /**
         * Encodes the specified HeartbeatAlertEvent message. Does not implicitly {@link omnora.HeartbeatAlertEvent.verify|verify} messages.
         * @function encode
         * @memberof omnora.HeartbeatAlertEvent
         * @static
         * @param {omnora.IHeartbeatAlertEvent} message HeartbeatAlertEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HeartbeatAlertEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nodeId != null && Object.hasOwnProperty.call(message, "nodeId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.nodeId);
            if (message.alertType != null && Object.hasOwnProperty.call(message, "alertType"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.alertType);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.timestamp);
            return writer;
        };

        /**
         * Encodes the specified HeartbeatAlertEvent message, length delimited. Does not implicitly {@link omnora.HeartbeatAlertEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.HeartbeatAlertEvent
         * @static
         * @param {omnora.IHeartbeatAlertEvent} message HeartbeatAlertEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HeartbeatAlertEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HeartbeatAlertEvent message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.HeartbeatAlertEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.HeartbeatAlertEvent} HeartbeatAlertEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HeartbeatAlertEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.HeartbeatAlertEvent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nodeId = reader.string();
                    break;
                case 2:
                    message.alertType = reader.string();
                    break;
                case 3:
                    message.timestamp = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a HeartbeatAlertEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.HeartbeatAlertEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.HeartbeatAlertEvent} HeartbeatAlertEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HeartbeatAlertEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HeartbeatAlertEvent message.
         * @function verify
         * @memberof omnora.HeartbeatAlertEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HeartbeatAlertEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                if (!$util.isString(message.nodeId))
                    return "nodeId: string expected";
            if (message.alertType != null && message.hasOwnProperty("alertType"))
                if (!$util.isString(message.alertType))
                    return "alertType: string expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            return null;
        };

        /**
         * Creates a HeartbeatAlertEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.HeartbeatAlertEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.HeartbeatAlertEvent} HeartbeatAlertEvent
         */
        HeartbeatAlertEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.HeartbeatAlertEvent)
                return object;
            var message = new $root.omnora.HeartbeatAlertEvent();
            if (object.nodeId != null)
                message.nodeId = String(object.nodeId);
            if (object.alertType != null)
                message.alertType = String(object.alertType);
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a HeartbeatAlertEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.HeartbeatAlertEvent
         * @static
         * @param {omnora.HeartbeatAlertEvent} message HeartbeatAlertEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HeartbeatAlertEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.nodeId = "";
                object.alertType = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
            }
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                object.nodeId = message.nodeId;
            if (message.alertType != null && message.hasOwnProperty("alertType"))
                object.alertType = message.alertType;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            return object;
        };

        /**
         * Converts this HeartbeatAlertEvent to JSON.
         * @function toJSON
         * @memberof omnora.HeartbeatAlertEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HeartbeatAlertEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return HeartbeatAlertEvent;
    })();

    omnora.VoiceCommandResult = (function() {

        /**
         * Properties of a VoiceCommandResult.
         * @memberof omnora
         * @interface IVoiceCommandResult
         * @property {string|null} [commandText] VoiceCommandResult commandText
         * @property {string|null} [mappedAction] VoiceCommandResult mappedAction
         * @property {string|null} [entityName] VoiceCommandResult entityName
         * @property {string|null} [amountPkr] VoiceCommandResult amountPkr
         * @property {boolean|null} [confidenceOk] VoiceCommandResult confidenceOk
         * @property {number|Long|null} [timestamp] VoiceCommandResult timestamp
         */

        /**
         * Constructs a new VoiceCommandResult.
         * @memberof omnora
         * @classdesc Represents a VoiceCommandResult.
         * @implements IVoiceCommandResult
         * @constructor
         * @param {omnora.IVoiceCommandResult=} [properties] Properties to set
         */
        function VoiceCommandResult(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * VoiceCommandResult commandText.
         * @member {string} commandText
         * @memberof omnora.VoiceCommandResult
         * @instance
         */
        VoiceCommandResult.prototype.commandText = "";

        /**
         * VoiceCommandResult mappedAction.
         * @member {string} mappedAction
         * @memberof omnora.VoiceCommandResult
         * @instance
         */
        VoiceCommandResult.prototype.mappedAction = "";

        /**
         * VoiceCommandResult entityName.
         * @member {string} entityName
         * @memberof omnora.VoiceCommandResult
         * @instance
         */
        VoiceCommandResult.prototype.entityName = "";

        /**
         * VoiceCommandResult amountPkr.
         * @member {string} amountPkr
         * @memberof omnora.VoiceCommandResult
         * @instance
         */
        VoiceCommandResult.prototype.amountPkr = "";

        /**
         * VoiceCommandResult confidenceOk.
         * @member {boolean} confidenceOk
         * @memberof omnora.VoiceCommandResult
         * @instance
         */
        VoiceCommandResult.prototype.confidenceOk = false;

        /**
         * VoiceCommandResult timestamp.
         * @member {number|Long} timestamp
         * @memberof omnora.VoiceCommandResult
         * @instance
         */
        VoiceCommandResult.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new VoiceCommandResult instance using the specified properties.
         * @function create
         * @memberof omnora.VoiceCommandResult
         * @static
         * @param {omnora.IVoiceCommandResult=} [properties] Properties to set
         * @returns {omnora.VoiceCommandResult} VoiceCommandResult instance
         */
        VoiceCommandResult.create = function create(properties) {
            return new VoiceCommandResult(properties);
        };

        /**
         * Encodes the specified VoiceCommandResult message. Does not implicitly {@link omnora.VoiceCommandResult.verify|verify} messages.
         * @function encode
         * @memberof omnora.VoiceCommandResult
         * @static
         * @param {omnora.IVoiceCommandResult} message VoiceCommandResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VoiceCommandResult.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.commandText != null && Object.hasOwnProperty.call(message, "commandText"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.commandText);
            if (message.mappedAction != null && Object.hasOwnProperty.call(message, "mappedAction"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.mappedAction);
            if (message.entityName != null && Object.hasOwnProperty.call(message, "entityName"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.entityName);
            if (message.amountPkr != null && Object.hasOwnProperty.call(message, "amountPkr"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.amountPkr);
            if (message.confidenceOk != null && Object.hasOwnProperty.call(message, "confidenceOk"))
                writer.uint32(/* id 5, wireType 0 =*/40).bool(message.confidenceOk);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 6, wireType 0 =*/48).int64(message.timestamp);
            return writer;
        };

        /**
         * Encodes the specified VoiceCommandResult message, length delimited. Does not implicitly {@link omnora.VoiceCommandResult.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.VoiceCommandResult
         * @static
         * @param {omnora.IVoiceCommandResult} message VoiceCommandResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VoiceCommandResult.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a VoiceCommandResult message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.VoiceCommandResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.VoiceCommandResult} VoiceCommandResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VoiceCommandResult.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.VoiceCommandResult();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.commandText = reader.string();
                    break;
                case 2:
                    message.mappedAction = reader.string();
                    break;
                case 3:
                    message.entityName = reader.string();
                    break;
                case 4:
                    message.amountPkr = reader.string();
                    break;
                case 5:
                    message.confidenceOk = reader.bool();
                    break;
                case 6:
                    message.timestamp = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a VoiceCommandResult message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.VoiceCommandResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.VoiceCommandResult} VoiceCommandResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VoiceCommandResult.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a VoiceCommandResult message.
         * @function verify
         * @memberof omnora.VoiceCommandResult
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        VoiceCommandResult.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.commandText != null && message.hasOwnProperty("commandText"))
                if (!$util.isString(message.commandText))
                    return "commandText: string expected";
            if (message.mappedAction != null && message.hasOwnProperty("mappedAction"))
                if (!$util.isString(message.mappedAction))
                    return "mappedAction: string expected";
            if (message.entityName != null && message.hasOwnProperty("entityName"))
                if (!$util.isString(message.entityName))
                    return "entityName: string expected";
            if (message.amountPkr != null && message.hasOwnProperty("amountPkr"))
                if (!$util.isString(message.amountPkr))
                    return "amountPkr: string expected";
            if (message.confidenceOk != null && message.hasOwnProperty("confidenceOk"))
                if (typeof message.confidenceOk !== "boolean")
                    return "confidenceOk: boolean expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            return null;
        };

        /**
         * Creates a VoiceCommandResult message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.VoiceCommandResult
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.VoiceCommandResult} VoiceCommandResult
         */
        VoiceCommandResult.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.VoiceCommandResult)
                return object;
            var message = new $root.omnora.VoiceCommandResult();
            if (object.commandText != null)
                message.commandText = String(object.commandText);
            if (object.mappedAction != null)
                message.mappedAction = String(object.mappedAction);
            if (object.entityName != null)
                message.entityName = String(object.entityName);
            if (object.amountPkr != null)
                message.amountPkr = String(object.amountPkr);
            if (object.confidenceOk != null)
                message.confidenceOk = Boolean(object.confidenceOk);
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a VoiceCommandResult message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.VoiceCommandResult
         * @static
         * @param {omnora.VoiceCommandResult} message VoiceCommandResult
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        VoiceCommandResult.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.commandText = "";
                object.mappedAction = "";
                object.entityName = "";
                object.amountPkr = "";
                object.confidenceOk = false;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
            }
            if (message.commandText != null && message.hasOwnProperty("commandText"))
                object.commandText = message.commandText;
            if (message.mappedAction != null && message.hasOwnProperty("mappedAction"))
                object.mappedAction = message.mappedAction;
            if (message.entityName != null && message.hasOwnProperty("entityName"))
                object.entityName = message.entityName;
            if (message.amountPkr != null && message.hasOwnProperty("amountPkr"))
                object.amountPkr = message.amountPkr;
            if (message.confidenceOk != null && message.hasOwnProperty("confidenceOk"))
                object.confidenceOk = message.confidenceOk;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            return object;
        };

        /**
         * Converts this VoiceCommandResult to JSON.
         * @function toJSON
         * @memberof omnora.VoiceCommandResult
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        VoiceCommandResult.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return VoiceCommandResult;
    })();

    omnora.NspEnvelope = (function() {

        /**
         * Properties of a NspEnvelope.
         * @memberof omnora
         * @interface INspEnvelope
         * @property {omnora.ISentinelBreachEvent|null} [sentinelBreach] NspEnvelope sentinelBreach
         * @property {omnora.ISystemLockCommand|null} [systemLock] NspEnvelope systemLock
         * @property {omnora.IGuardianAuthRequest|null} [guardianRequest] NspEnvelope guardianRequest
         * @property {omnora.IGuardianAuthResponse|null} [guardianResponse] NspEnvelope guardianResponse
         * @property {omnora.IHeartbeatAlertEvent|null} [heartbeatAlert] NspEnvelope heartbeatAlert
         * @property {omnora.IVoiceCommandResult|null} [voiceCommandResult] NspEnvelope voiceCommandResult
         * @property {omnora.IStockLookupRequest|null} [stockLookupReq] NspEnvelope stockLookupReq
         * @property {omnora.IStockLookupResponse|null} [stockLookupRes] NspEnvelope stockLookupRes
         * @property {omnora.IReadReceipt|null} [readReceipt] NspEnvelope readReceipt
         * @property {omnora.IPresenceUpdate|null} [presenceUpdate] NspEnvelope presenceUpdate
         * @property {omnora.ILedgerSummaryRequest|null} [ledgerSummaryReq] NspEnvelope ledgerSummaryReq
         * @property {omnora.ILedgerSummaryResponse|null} [ledgerSummaryRes] NspEnvelope ledgerSummaryRes
         * @property {omnora.IPartyBalanceRequest|null} [partyBalanceReq] NspEnvelope partyBalanceReq
         * @property {omnora.IPartyBalanceResponse|null} [partyBalanceRes] NspEnvelope partyBalanceRes
         * @property {omnora.IInvoiceSummaryRequest|null} [invoiceSummaryReq] NspEnvelope invoiceSummaryReq
         * @property {omnora.IInvoiceSummaryResponse|null} [invoiceSummaryRes] NspEnvelope invoiceSummaryRes
         * @property {omnora.IPaySlipRequest|null} [paySlipReq] NspEnvelope paySlipReq
         * @property {omnora.IPaySlipResponse|null} [paySlipRes] NspEnvelope paySlipRes
         * @property {omnora.IBranchListRequest|null} [branchListReq] NspEnvelope branchListReq
         * @property {omnora.IBranchListResponse|null} [branchListRes] NspEnvelope branchListRes
         * @property {omnora.ISwitchBranchRequest|null} [switchBranchReq] NspEnvelope switchBranchReq
         * @property {omnora.ISwitchBranchResponse|null} [switchBranchRes] NspEnvelope switchBranchRes
         * @property {omnora.IDetectionHistoryRequest|null} [detectionHistoryReq] NspEnvelope detectionHistoryReq
         * @property {omnora.IDetectionHistoryResponse|null} [detectionHistoryRes] NspEnvelope detectionHistoryRes
         * @property {omnora.ICameraStatusRequest|null} [cameraStatusReq] NspEnvelope cameraStatusReq
         * @property {omnora.ICameraStatusResponse|null} [cameraStatusRes] NspEnvelope cameraStatusRes
         */

        /**
         * Constructs a new NspEnvelope.
         * @memberof omnora
         * @classdesc Represents a NspEnvelope.
         * @implements INspEnvelope
         * @constructor
         * @param {omnora.INspEnvelope=} [properties] Properties to set
         */
        function NspEnvelope(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * NspEnvelope sentinelBreach.
         * @member {omnora.ISentinelBreachEvent|null|undefined} sentinelBreach
         * @memberof omnora.NspEnvelope
         * @instance
         */
        NspEnvelope.prototype.sentinelBreach = null;

        /**
         * NspEnvelope systemLock.
         * @member {omnora.ISystemLockCommand|null|undefined} systemLock
         * @memberof omnora.NspEnvelope
         * @instance
         */
        NspEnvelope.prototype.systemLock = null;

        /**
         * NspEnvelope guardianRequest.
         * @member {omnora.IGuardianAuthRequest|null|undefined} guardianRequest
         * @memberof omnora.NspEnvelope
         * @instance
         */
        NspEnvelope.prototype.guardianRequest = null;

        /**
         * NspEnvelope guardianResponse.
         * @member {omnora.IGuardianAuthResponse|null|undefined} guardianResponse
         * @memberof omnora.NspEnvelope
         * @instance
         */
        NspEnvelope.prototype.guardianResponse = null;

        /**
         * NspEnvelope heartbeatAlert.
         * @member {omnora.IHeartbeatAlertEvent|null|undefined} heartbeatAlert
         * @memberof omnora.NspEnvelope
         * @instance
         */
        NspEnvelope.prototype.heartbeatAlert = null;

        /**
         * NspEnvelope voiceCommandResult.
         * @member {omnora.IVoiceCommandResult|null|undefined} voiceCommandResult
         * @memberof omnora.NspEnvelope
         * @instance
         */
        NspEnvelope.prototype.voiceCommandResult = null;

        /**
         * NspEnvelope stockLookupReq.
         * @member {omnora.IStockLookupRequest|null|undefined} stockLookupReq
         * @memberof omnora.NspEnvelope
         * @instance
         */
        NspEnvelope.prototype.stockLookupReq = null;

        /**
         * NspEnvelope stockLookupRes.
         * @member {omnora.IStockLookupResponse|null|undefined} stockLookupRes
         * @memberof omnora.NspEnvelope
         * @instance
         */
        NspEnvelope.prototype.stockLookupRes = null;

        /**
         * NspEnvelope readReceipt.
         * @member {omnora.IReadReceipt|null|undefined} readReceipt
         * @memberof omnora.NspEnvelope
         * @instance
         */
        NspEnvelope.prototype.readReceipt = null;

        /**
         * NspEnvelope presenceUpdate.
         * @member {omnora.IPresenceUpdate|null|undefined} presenceUpdate
         * @memberof omnora.NspEnvelope
         * @instance
         */
        NspEnvelope.prototype.presenceUpdate = null;

        /**
         * NspEnvelope ledgerSummaryReq.
         * @member {omnora.ILedgerSummaryRequest|null|undefined} ledgerSummaryReq
         * @memberof omnora.NspEnvelope
         * @instance
         */
        NspEnvelope.prototype.ledgerSummaryReq = null;

        /**
         * NspEnvelope ledgerSummaryRes.
         * @member {omnora.ILedgerSummaryResponse|null|undefined} ledgerSummaryRes
         * @memberof omnora.NspEnvelope
         * @instance
         */
        NspEnvelope.prototype.ledgerSummaryRes = null;

        /**
         * NspEnvelope partyBalanceReq.
         * @member {omnora.IPartyBalanceRequest|null|undefined} partyBalanceReq
         * @memberof omnora.NspEnvelope
         * @instance
         */
        NspEnvelope.prototype.partyBalanceReq = null;

        /**
         * NspEnvelope partyBalanceRes.
         * @member {omnora.IPartyBalanceResponse|null|undefined} partyBalanceRes
         * @memberof omnora.NspEnvelope
         * @instance
         */
        NspEnvelope.prototype.partyBalanceRes = null;

        /**
         * NspEnvelope invoiceSummaryReq.
         * @member {omnora.IInvoiceSummaryRequest|null|undefined} invoiceSummaryReq
         * @memberof omnora.NspEnvelope
         * @instance
         */
        NspEnvelope.prototype.invoiceSummaryReq = null;

        /**
         * NspEnvelope invoiceSummaryRes.
         * @member {omnora.IInvoiceSummaryResponse|null|undefined} invoiceSummaryRes
         * @memberof omnora.NspEnvelope
         * @instance
         */
        NspEnvelope.prototype.invoiceSummaryRes = null;

        /**
         * NspEnvelope paySlipReq.
         * @member {omnora.IPaySlipRequest|null|undefined} paySlipReq
         * @memberof omnora.NspEnvelope
         * @instance
         */
        NspEnvelope.prototype.paySlipReq = null;

        /**
         * NspEnvelope paySlipRes.
         * @member {omnora.IPaySlipResponse|null|undefined} paySlipRes
         * @memberof omnora.NspEnvelope
         * @instance
         */
        NspEnvelope.prototype.paySlipRes = null;

        /**
         * NspEnvelope branchListReq.
         * @member {omnora.IBranchListRequest|null|undefined} branchListReq
         * @memberof omnora.NspEnvelope
         * @instance
         */
        NspEnvelope.prototype.branchListReq = null;

        /**
         * NspEnvelope branchListRes.
         * @member {omnora.IBranchListResponse|null|undefined} branchListRes
         * @memberof omnora.NspEnvelope
         * @instance
         */
        NspEnvelope.prototype.branchListRes = null;

        /**
         * NspEnvelope switchBranchReq.
         * @member {omnora.ISwitchBranchRequest|null|undefined} switchBranchReq
         * @memberof omnora.NspEnvelope
         * @instance
         */
        NspEnvelope.prototype.switchBranchReq = null;

        /**
         * NspEnvelope switchBranchRes.
         * @member {omnora.ISwitchBranchResponse|null|undefined} switchBranchRes
         * @memberof omnora.NspEnvelope
         * @instance
         */
        NspEnvelope.prototype.switchBranchRes = null;

        /**
         * NspEnvelope detectionHistoryReq.
         * @member {omnora.IDetectionHistoryRequest|null|undefined} detectionHistoryReq
         * @memberof omnora.NspEnvelope
         * @instance
         */
        NspEnvelope.prototype.detectionHistoryReq = null;

        /**
         * NspEnvelope detectionHistoryRes.
         * @member {omnora.IDetectionHistoryResponse|null|undefined} detectionHistoryRes
         * @memberof omnora.NspEnvelope
         * @instance
         */
        NspEnvelope.prototype.detectionHistoryRes = null;

        /**
         * NspEnvelope cameraStatusReq.
         * @member {omnora.ICameraStatusRequest|null|undefined} cameraStatusReq
         * @memberof omnora.NspEnvelope
         * @instance
         */
        NspEnvelope.prototype.cameraStatusReq = null;

        /**
         * NspEnvelope cameraStatusRes.
         * @member {omnora.ICameraStatusResponse|null|undefined} cameraStatusRes
         * @memberof omnora.NspEnvelope
         * @instance
         */
        NspEnvelope.prototype.cameraStatusRes = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * NspEnvelope payload.
         * @member {"sentinelBreach"|"systemLock"|"guardianRequest"|"guardianResponse"|"heartbeatAlert"|"voiceCommandResult"|"stockLookupReq"|"stockLookupRes"|"readReceipt"|"presenceUpdate"|"ledgerSummaryReq"|"ledgerSummaryRes"|"partyBalanceReq"|"partyBalanceRes"|"invoiceSummaryReq"|"invoiceSummaryRes"|"paySlipReq"|"paySlipRes"|"branchListReq"|"branchListRes"|"switchBranchReq"|"switchBranchRes"|"detectionHistoryReq"|"detectionHistoryRes"|"cameraStatusReq"|"cameraStatusRes"|undefined} payload
         * @memberof omnora.NspEnvelope
         * @instance
         */
        Object.defineProperty(NspEnvelope.prototype, "payload", {
            get: $util.oneOfGetter($oneOfFields = ["sentinelBreach", "systemLock", "guardianRequest", "guardianResponse", "heartbeatAlert", "voiceCommandResult", "stockLookupReq", "stockLookupRes", "readReceipt", "presenceUpdate", "ledgerSummaryReq", "ledgerSummaryRes", "partyBalanceReq", "partyBalanceRes", "invoiceSummaryReq", "invoiceSummaryRes", "paySlipReq", "paySlipRes", "branchListReq", "branchListRes", "switchBranchReq", "switchBranchRes", "detectionHistoryReq", "detectionHistoryRes", "cameraStatusReq", "cameraStatusRes"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new NspEnvelope instance using the specified properties.
         * @function create
         * @memberof omnora.NspEnvelope
         * @static
         * @param {omnora.INspEnvelope=} [properties] Properties to set
         * @returns {omnora.NspEnvelope} NspEnvelope instance
         */
        NspEnvelope.create = function create(properties) {
            return new NspEnvelope(properties);
        };

        /**
         * Encodes the specified NspEnvelope message. Does not implicitly {@link omnora.NspEnvelope.verify|verify} messages.
         * @function encode
         * @memberof omnora.NspEnvelope
         * @static
         * @param {omnora.INspEnvelope} message NspEnvelope message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NspEnvelope.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.sentinelBreach != null && Object.hasOwnProperty.call(message, "sentinelBreach"))
                $root.omnora.SentinelBreachEvent.encode(message.sentinelBreach, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.systemLock != null && Object.hasOwnProperty.call(message, "systemLock"))
                $root.omnora.SystemLockCommand.encode(message.systemLock, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.guardianRequest != null && Object.hasOwnProperty.call(message, "guardianRequest"))
                $root.omnora.GuardianAuthRequest.encode(message.guardianRequest, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.guardianResponse != null && Object.hasOwnProperty.call(message, "guardianResponse"))
                $root.omnora.GuardianAuthResponse.encode(message.guardianResponse, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.heartbeatAlert != null && Object.hasOwnProperty.call(message, "heartbeatAlert"))
                $root.omnora.HeartbeatAlertEvent.encode(message.heartbeatAlert, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.voiceCommandResult != null && Object.hasOwnProperty.call(message, "voiceCommandResult"))
                $root.omnora.VoiceCommandResult.encode(message.voiceCommandResult, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.stockLookupReq != null && Object.hasOwnProperty.call(message, "stockLookupReq"))
                $root.omnora.StockLookupRequest.encode(message.stockLookupReq, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.stockLookupRes != null && Object.hasOwnProperty.call(message, "stockLookupRes"))
                $root.omnora.StockLookupResponse.encode(message.stockLookupRes, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.readReceipt != null && Object.hasOwnProperty.call(message, "readReceipt"))
                $root.omnora.ReadReceipt.encode(message.readReceipt, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
            if (message.presenceUpdate != null && Object.hasOwnProperty.call(message, "presenceUpdate"))
                $root.omnora.PresenceUpdate.encode(message.presenceUpdate, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
            if (message.ledgerSummaryReq != null && Object.hasOwnProperty.call(message, "ledgerSummaryReq"))
                $root.omnora.LedgerSummaryRequest.encode(message.ledgerSummaryReq, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
            if (message.ledgerSummaryRes != null && Object.hasOwnProperty.call(message, "ledgerSummaryRes"))
                $root.omnora.LedgerSummaryResponse.encode(message.ledgerSummaryRes, writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
            if (message.partyBalanceReq != null && Object.hasOwnProperty.call(message, "partyBalanceReq"))
                $root.omnora.PartyBalanceRequest.encode(message.partyBalanceReq, writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
            if (message.partyBalanceRes != null && Object.hasOwnProperty.call(message, "partyBalanceRes"))
                $root.omnora.PartyBalanceResponse.encode(message.partyBalanceRes, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
            if (message.invoiceSummaryReq != null && Object.hasOwnProperty.call(message, "invoiceSummaryReq"))
                $root.omnora.InvoiceSummaryRequest.encode(message.invoiceSummaryReq, writer.uint32(/* id 16, wireType 2 =*/130).fork()).ldelim();
            if (message.invoiceSummaryRes != null && Object.hasOwnProperty.call(message, "invoiceSummaryRes"))
                $root.omnora.InvoiceSummaryResponse.encode(message.invoiceSummaryRes, writer.uint32(/* id 17, wireType 2 =*/138).fork()).ldelim();
            if (message.paySlipReq != null && Object.hasOwnProperty.call(message, "paySlipReq"))
                $root.omnora.PaySlipRequest.encode(message.paySlipReq, writer.uint32(/* id 18, wireType 2 =*/146).fork()).ldelim();
            if (message.paySlipRes != null && Object.hasOwnProperty.call(message, "paySlipRes"))
                $root.omnora.PaySlipResponse.encode(message.paySlipRes, writer.uint32(/* id 19, wireType 2 =*/154).fork()).ldelim();
            if (message.branchListReq != null && Object.hasOwnProperty.call(message, "branchListReq"))
                $root.omnora.BranchListRequest.encode(message.branchListReq, writer.uint32(/* id 20, wireType 2 =*/162).fork()).ldelim();
            if (message.branchListRes != null && Object.hasOwnProperty.call(message, "branchListRes"))
                $root.omnora.BranchListResponse.encode(message.branchListRes, writer.uint32(/* id 21, wireType 2 =*/170).fork()).ldelim();
            if (message.switchBranchReq != null && Object.hasOwnProperty.call(message, "switchBranchReq"))
                $root.omnora.SwitchBranchRequest.encode(message.switchBranchReq, writer.uint32(/* id 22, wireType 2 =*/178).fork()).ldelim();
            if (message.switchBranchRes != null && Object.hasOwnProperty.call(message, "switchBranchRes"))
                $root.omnora.SwitchBranchResponse.encode(message.switchBranchRes, writer.uint32(/* id 23, wireType 2 =*/186).fork()).ldelim();
            if (message.detectionHistoryReq != null && Object.hasOwnProperty.call(message, "detectionHistoryReq"))
                $root.omnora.DetectionHistoryRequest.encode(message.detectionHistoryReq, writer.uint32(/* id 24, wireType 2 =*/194).fork()).ldelim();
            if (message.detectionHistoryRes != null && Object.hasOwnProperty.call(message, "detectionHistoryRes"))
                $root.omnora.DetectionHistoryResponse.encode(message.detectionHistoryRes, writer.uint32(/* id 25, wireType 2 =*/202).fork()).ldelim();
            if (message.cameraStatusReq != null && Object.hasOwnProperty.call(message, "cameraStatusReq"))
                $root.omnora.CameraStatusRequest.encode(message.cameraStatusReq, writer.uint32(/* id 26, wireType 2 =*/210).fork()).ldelim();
            if (message.cameraStatusRes != null && Object.hasOwnProperty.call(message, "cameraStatusRes"))
                $root.omnora.CameraStatusResponse.encode(message.cameraStatusRes, writer.uint32(/* id 27, wireType 2 =*/218).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified NspEnvelope message, length delimited. Does not implicitly {@link omnora.NspEnvelope.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.NspEnvelope
         * @static
         * @param {omnora.INspEnvelope} message NspEnvelope message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NspEnvelope.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a NspEnvelope message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.NspEnvelope
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.NspEnvelope} NspEnvelope
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NspEnvelope.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.NspEnvelope();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.sentinelBreach = $root.omnora.SentinelBreachEvent.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.systemLock = $root.omnora.SystemLockCommand.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.guardianRequest = $root.omnora.GuardianAuthRequest.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.guardianResponse = $root.omnora.GuardianAuthResponse.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.heartbeatAlert = $root.omnora.HeartbeatAlertEvent.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.voiceCommandResult = $root.omnora.VoiceCommandResult.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.stockLookupReq = $root.omnora.StockLookupRequest.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.stockLookupRes = $root.omnora.StockLookupResponse.decode(reader, reader.uint32());
                    break;
                case 9:
                    message.readReceipt = $root.omnora.ReadReceipt.decode(reader, reader.uint32());
                    break;
                case 10:
                    message.presenceUpdate = $root.omnora.PresenceUpdate.decode(reader, reader.uint32());
                    break;
                case 12:
                    message.ledgerSummaryReq = $root.omnora.LedgerSummaryRequest.decode(reader, reader.uint32());
                    break;
                case 13:
                    message.ledgerSummaryRes = $root.omnora.LedgerSummaryResponse.decode(reader, reader.uint32());
                    break;
                case 14:
                    message.partyBalanceReq = $root.omnora.PartyBalanceRequest.decode(reader, reader.uint32());
                    break;
                case 15:
                    message.partyBalanceRes = $root.omnora.PartyBalanceResponse.decode(reader, reader.uint32());
                    break;
                case 16:
                    message.invoiceSummaryReq = $root.omnora.InvoiceSummaryRequest.decode(reader, reader.uint32());
                    break;
                case 17:
                    message.invoiceSummaryRes = $root.omnora.InvoiceSummaryResponse.decode(reader, reader.uint32());
                    break;
                case 18:
                    message.paySlipReq = $root.omnora.PaySlipRequest.decode(reader, reader.uint32());
                    break;
                case 19:
                    message.paySlipRes = $root.omnora.PaySlipResponse.decode(reader, reader.uint32());
                    break;
                case 20:
                    message.branchListReq = $root.omnora.BranchListRequest.decode(reader, reader.uint32());
                    break;
                case 21:
                    message.branchListRes = $root.omnora.BranchListResponse.decode(reader, reader.uint32());
                    break;
                case 22:
                    message.switchBranchReq = $root.omnora.SwitchBranchRequest.decode(reader, reader.uint32());
                    break;
                case 23:
                    message.switchBranchRes = $root.omnora.SwitchBranchResponse.decode(reader, reader.uint32());
                    break;
                case 24:
                    message.detectionHistoryReq = $root.omnora.DetectionHistoryRequest.decode(reader, reader.uint32());
                    break;
                case 25:
                    message.detectionHistoryRes = $root.omnora.DetectionHistoryResponse.decode(reader, reader.uint32());
                    break;
                case 26:
                    message.cameraStatusReq = $root.omnora.CameraStatusRequest.decode(reader, reader.uint32());
                    break;
                case 27:
                    message.cameraStatusRes = $root.omnora.CameraStatusResponse.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a NspEnvelope message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.NspEnvelope
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.NspEnvelope} NspEnvelope
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NspEnvelope.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a NspEnvelope message.
         * @function verify
         * @memberof omnora.NspEnvelope
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        NspEnvelope.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.sentinelBreach != null && message.hasOwnProperty("sentinelBreach")) {
                properties.payload = 1;
                {
                    var error = $root.omnora.SentinelBreachEvent.verify(message.sentinelBreach);
                    if (error)
                        return "sentinelBreach." + error;
                }
            }
            if (message.systemLock != null && message.hasOwnProperty("systemLock")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.omnora.SystemLockCommand.verify(message.systemLock);
                    if (error)
                        return "systemLock." + error;
                }
            }
            if (message.guardianRequest != null && message.hasOwnProperty("guardianRequest")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.omnora.GuardianAuthRequest.verify(message.guardianRequest);
                    if (error)
                        return "guardianRequest." + error;
                }
            }
            if (message.guardianResponse != null && message.hasOwnProperty("guardianResponse")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.omnora.GuardianAuthResponse.verify(message.guardianResponse);
                    if (error)
                        return "guardianResponse." + error;
                }
            }
            if (message.heartbeatAlert != null && message.hasOwnProperty("heartbeatAlert")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.omnora.HeartbeatAlertEvent.verify(message.heartbeatAlert);
                    if (error)
                        return "heartbeatAlert." + error;
                }
            }
            if (message.voiceCommandResult != null && message.hasOwnProperty("voiceCommandResult")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.omnora.VoiceCommandResult.verify(message.voiceCommandResult);
                    if (error)
                        return "voiceCommandResult." + error;
                }
            }
            if (message.stockLookupReq != null && message.hasOwnProperty("stockLookupReq")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.omnora.StockLookupRequest.verify(message.stockLookupReq);
                    if (error)
                        return "stockLookupReq." + error;
                }
            }
            if (message.stockLookupRes != null && message.hasOwnProperty("stockLookupRes")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.omnora.StockLookupResponse.verify(message.stockLookupRes);
                    if (error)
                        return "stockLookupRes." + error;
                }
            }
            if (message.readReceipt != null && message.hasOwnProperty("readReceipt")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.omnora.ReadReceipt.verify(message.readReceipt);
                    if (error)
                        return "readReceipt." + error;
                }
            }
            if (message.presenceUpdate != null && message.hasOwnProperty("presenceUpdate")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.omnora.PresenceUpdate.verify(message.presenceUpdate);
                    if (error)
                        return "presenceUpdate." + error;
                }
            }
            if (message.ledgerSummaryReq != null && message.hasOwnProperty("ledgerSummaryReq")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.omnora.LedgerSummaryRequest.verify(message.ledgerSummaryReq);
                    if (error)
                        return "ledgerSummaryReq." + error;
                }
            }
            if (message.ledgerSummaryRes != null && message.hasOwnProperty("ledgerSummaryRes")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.omnora.LedgerSummaryResponse.verify(message.ledgerSummaryRes);
                    if (error)
                        return "ledgerSummaryRes." + error;
                }
            }
            if (message.partyBalanceReq != null && message.hasOwnProperty("partyBalanceReq")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.omnora.PartyBalanceRequest.verify(message.partyBalanceReq);
                    if (error)
                        return "partyBalanceReq." + error;
                }
            }
            if (message.partyBalanceRes != null && message.hasOwnProperty("partyBalanceRes")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.omnora.PartyBalanceResponse.verify(message.partyBalanceRes);
                    if (error)
                        return "partyBalanceRes." + error;
                }
            }
            if (message.invoiceSummaryReq != null && message.hasOwnProperty("invoiceSummaryReq")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.omnora.InvoiceSummaryRequest.verify(message.invoiceSummaryReq);
                    if (error)
                        return "invoiceSummaryReq." + error;
                }
            }
            if (message.invoiceSummaryRes != null && message.hasOwnProperty("invoiceSummaryRes")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.omnora.InvoiceSummaryResponse.verify(message.invoiceSummaryRes);
                    if (error)
                        return "invoiceSummaryRes." + error;
                }
            }
            if (message.paySlipReq != null && message.hasOwnProperty("paySlipReq")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.omnora.PaySlipRequest.verify(message.paySlipReq);
                    if (error)
                        return "paySlipReq." + error;
                }
            }
            if (message.paySlipRes != null && message.hasOwnProperty("paySlipRes")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.omnora.PaySlipResponse.verify(message.paySlipRes);
                    if (error)
                        return "paySlipRes." + error;
                }
            }
            if (message.branchListReq != null && message.hasOwnProperty("branchListReq")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.omnora.BranchListRequest.verify(message.branchListReq);
                    if (error)
                        return "branchListReq." + error;
                }
            }
            if (message.branchListRes != null && message.hasOwnProperty("branchListRes")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.omnora.BranchListResponse.verify(message.branchListRes);
                    if (error)
                        return "branchListRes." + error;
                }
            }
            if (message.switchBranchReq != null && message.hasOwnProperty("switchBranchReq")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.omnora.SwitchBranchRequest.verify(message.switchBranchReq);
                    if (error)
                        return "switchBranchReq." + error;
                }
            }
            if (message.switchBranchRes != null && message.hasOwnProperty("switchBranchRes")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.omnora.SwitchBranchResponse.verify(message.switchBranchRes);
                    if (error)
                        return "switchBranchRes." + error;
                }
            }
            if (message.detectionHistoryReq != null && message.hasOwnProperty("detectionHistoryReq")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.omnora.DetectionHistoryRequest.verify(message.detectionHistoryReq);
                    if (error)
                        return "detectionHistoryReq." + error;
                }
            }
            if (message.detectionHistoryRes != null && message.hasOwnProperty("detectionHistoryRes")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.omnora.DetectionHistoryResponse.verify(message.detectionHistoryRes);
                    if (error)
                        return "detectionHistoryRes." + error;
                }
            }
            if (message.cameraStatusReq != null && message.hasOwnProperty("cameraStatusReq")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.omnora.CameraStatusRequest.verify(message.cameraStatusReq);
                    if (error)
                        return "cameraStatusReq." + error;
                }
            }
            if (message.cameraStatusRes != null && message.hasOwnProperty("cameraStatusRes")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.omnora.CameraStatusResponse.verify(message.cameraStatusRes);
                    if (error)
                        return "cameraStatusRes." + error;
                }
            }
            return null;
        };

        /**
         * Creates a NspEnvelope message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.NspEnvelope
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.NspEnvelope} NspEnvelope
         */
        NspEnvelope.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.NspEnvelope)
                return object;
            var message = new $root.omnora.NspEnvelope();
            if (object.sentinelBreach != null) {
                if (typeof object.sentinelBreach !== "object")
                    throw TypeError(".omnora.NspEnvelope.sentinelBreach: object expected");
                message.sentinelBreach = $root.omnora.SentinelBreachEvent.fromObject(object.sentinelBreach);
            }
            if (object.systemLock != null) {
                if (typeof object.systemLock !== "object")
                    throw TypeError(".omnora.NspEnvelope.systemLock: object expected");
                message.systemLock = $root.omnora.SystemLockCommand.fromObject(object.systemLock);
            }
            if (object.guardianRequest != null) {
                if (typeof object.guardianRequest !== "object")
                    throw TypeError(".omnora.NspEnvelope.guardianRequest: object expected");
                message.guardianRequest = $root.omnora.GuardianAuthRequest.fromObject(object.guardianRequest);
            }
            if (object.guardianResponse != null) {
                if (typeof object.guardianResponse !== "object")
                    throw TypeError(".omnora.NspEnvelope.guardianResponse: object expected");
                message.guardianResponse = $root.omnora.GuardianAuthResponse.fromObject(object.guardianResponse);
            }
            if (object.heartbeatAlert != null) {
                if (typeof object.heartbeatAlert !== "object")
                    throw TypeError(".omnora.NspEnvelope.heartbeatAlert: object expected");
                message.heartbeatAlert = $root.omnora.HeartbeatAlertEvent.fromObject(object.heartbeatAlert);
            }
            if (object.voiceCommandResult != null) {
                if (typeof object.voiceCommandResult !== "object")
                    throw TypeError(".omnora.NspEnvelope.voiceCommandResult: object expected");
                message.voiceCommandResult = $root.omnora.VoiceCommandResult.fromObject(object.voiceCommandResult);
            }
            if (object.stockLookupReq != null) {
                if (typeof object.stockLookupReq !== "object")
                    throw TypeError(".omnora.NspEnvelope.stockLookupReq: object expected");
                message.stockLookupReq = $root.omnora.StockLookupRequest.fromObject(object.stockLookupReq);
            }
            if (object.stockLookupRes != null) {
                if (typeof object.stockLookupRes !== "object")
                    throw TypeError(".omnora.NspEnvelope.stockLookupRes: object expected");
                message.stockLookupRes = $root.omnora.StockLookupResponse.fromObject(object.stockLookupRes);
            }
            if (object.readReceipt != null) {
                if (typeof object.readReceipt !== "object")
                    throw TypeError(".omnora.NspEnvelope.readReceipt: object expected");
                message.readReceipt = $root.omnora.ReadReceipt.fromObject(object.readReceipt);
            }
            if (object.presenceUpdate != null) {
                if (typeof object.presenceUpdate !== "object")
                    throw TypeError(".omnora.NspEnvelope.presenceUpdate: object expected");
                message.presenceUpdate = $root.omnora.PresenceUpdate.fromObject(object.presenceUpdate);
            }
            if (object.ledgerSummaryReq != null) {
                if (typeof object.ledgerSummaryReq !== "object")
                    throw TypeError(".omnora.NspEnvelope.ledgerSummaryReq: object expected");
                message.ledgerSummaryReq = $root.omnora.LedgerSummaryRequest.fromObject(object.ledgerSummaryReq);
            }
            if (object.ledgerSummaryRes != null) {
                if (typeof object.ledgerSummaryRes !== "object")
                    throw TypeError(".omnora.NspEnvelope.ledgerSummaryRes: object expected");
                message.ledgerSummaryRes = $root.omnora.LedgerSummaryResponse.fromObject(object.ledgerSummaryRes);
            }
            if (object.partyBalanceReq != null) {
                if (typeof object.partyBalanceReq !== "object")
                    throw TypeError(".omnora.NspEnvelope.partyBalanceReq: object expected");
                message.partyBalanceReq = $root.omnora.PartyBalanceRequest.fromObject(object.partyBalanceReq);
            }
            if (object.partyBalanceRes != null) {
                if (typeof object.partyBalanceRes !== "object")
                    throw TypeError(".omnora.NspEnvelope.partyBalanceRes: object expected");
                message.partyBalanceRes = $root.omnora.PartyBalanceResponse.fromObject(object.partyBalanceRes);
            }
            if (object.invoiceSummaryReq != null) {
                if (typeof object.invoiceSummaryReq !== "object")
                    throw TypeError(".omnora.NspEnvelope.invoiceSummaryReq: object expected");
                message.invoiceSummaryReq = $root.omnora.InvoiceSummaryRequest.fromObject(object.invoiceSummaryReq);
            }
            if (object.invoiceSummaryRes != null) {
                if (typeof object.invoiceSummaryRes !== "object")
                    throw TypeError(".omnora.NspEnvelope.invoiceSummaryRes: object expected");
                message.invoiceSummaryRes = $root.omnora.InvoiceSummaryResponse.fromObject(object.invoiceSummaryRes);
            }
            if (object.paySlipReq != null) {
                if (typeof object.paySlipReq !== "object")
                    throw TypeError(".omnora.NspEnvelope.paySlipReq: object expected");
                message.paySlipReq = $root.omnora.PaySlipRequest.fromObject(object.paySlipReq);
            }
            if (object.paySlipRes != null) {
                if (typeof object.paySlipRes !== "object")
                    throw TypeError(".omnora.NspEnvelope.paySlipRes: object expected");
                message.paySlipRes = $root.omnora.PaySlipResponse.fromObject(object.paySlipRes);
            }
            if (object.branchListReq != null) {
                if (typeof object.branchListReq !== "object")
                    throw TypeError(".omnora.NspEnvelope.branchListReq: object expected");
                message.branchListReq = $root.omnora.BranchListRequest.fromObject(object.branchListReq);
            }
            if (object.branchListRes != null) {
                if (typeof object.branchListRes !== "object")
                    throw TypeError(".omnora.NspEnvelope.branchListRes: object expected");
                message.branchListRes = $root.omnora.BranchListResponse.fromObject(object.branchListRes);
            }
            if (object.switchBranchReq != null) {
                if (typeof object.switchBranchReq !== "object")
                    throw TypeError(".omnora.NspEnvelope.switchBranchReq: object expected");
                message.switchBranchReq = $root.omnora.SwitchBranchRequest.fromObject(object.switchBranchReq);
            }
            if (object.switchBranchRes != null) {
                if (typeof object.switchBranchRes !== "object")
                    throw TypeError(".omnora.NspEnvelope.switchBranchRes: object expected");
                message.switchBranchRes = $root.omnora.SwitchBranchResponse.fromObject(object.switchBranchRes);
            }
            if (object.detectionHistoryReq != null) {
                if (typeof object.detectionHistoryReq !== "object")
                    throw TypeError(".omnora.NspEnvelope.detectionHistoryReq: object expected");
                message.detectionHistoryReq = $root.omnora.DetectionHistoryRequest.fromObject(object.detectionHistoryReq);
            }
            if (object.detectionHistoryRes != null) {
                if (typeof object.detectionHistoryRes !== "object")
                    throw TypeError(".omnora.NspEnvelope.detectionHistoryRes: object expected");
                message.detectionHistoryRes = $root.omnora.DetectionHistoryResponse.fromObject(object.detectionHistoryRes);
            }
            if (object.cameraStatusReq != null) {
                if (typeof object.cameraStatusReq !== "object")
                    throw TypeError(".omnora.NspEnvelope.cameraStatusReq: object expected");
                message.cameraStatusReq = $root.omnora.CameraStatusRequest.fromObject(object.cameraStatusReq);
            }
            if (object.cameraStatusRes != null) {
                if (typeof object.cameraStatusRes !== "object")
                    throw TypeError(".omnora.NspEnvelope.cameraStatusRes: object expected");
                message.cameraStatusRes = $root.omnora.CameraStatusResponse.fromObject(object.cameraStatusRes);
            }
            return message;
        };

        /**
         * Creates a plain object from a NspEnvelope message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.NspEnvelope
         * @static
         * @param {omnora.NspEnvelope} message NspEnvelope
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        NspEnvelope.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (message.sentinelBreach != null && message.hasOwnProperty("sentinelBreach")) {
                object.sentinelBreach = $root.omnora.SentinelBreachEvent.toObject(message.sentinelBreach, options);
                if (options.oneofs)
                    object.payload = "sentinelBreach";
            }
            if (message.systemLock != null && message.hasOwnProperty("systemLock")) {
                object.systemLock = $root.omnora.SystemLockCommand.toObject(message.systemLock, options);
                if (options.oneofs)
                    object.payload = "systemLock";
            }
            if (message.guardianRequest != null && message.hasOwnProperty("guardianRequest")) {
                object.guardianRequest = $root.omnora.GuardianAuthRequest.toObject(message.guardianRequest, options);
                if (options.oneofs)
                    object.payload = "guardianRequest";
            }
            if (message.guardianResponse != null && message.hasOwnProperty("guardianResponse")) {
                object.guardianResponse = $root.omnora.GuardianAuthResponse.toObject(message.guardianResponse, options);
                if (options.oneofs)
                    object.payload = "guardianResponse";
            }
            if (message.heartbeatAlert != null && message.hasOwnProperty("heartbeatAlert")) {
                object.heartbeatAlert = $root.omnora.HeartbeatAlertEvent.toObject(message.heartbeatAlert, options);
                if (options.oneofs)
                    object.payload = "heartbeatAlert";
            }
            if (message.voiceCommandResult != null && message.hasOwnProperty("voiceCommandResult")) {
                object.voiceCommandResult = $root.omnora.VoiceCommandResult.toObject(message.voiceCommandResult, options);
                if (options.oneofs)
                    object.payload = "voiceCommandResult";
            }
            if (message.stockLookupReq != null && message.hasOwnProperty("stockLookupReq")) {
                object.stockLookupReq = $root.omnora.StockLookupRequest.toObject(message.stockLookupReq, options);
                if (options.oneofs)
                    object.payload = "stockLookupReq";
            }
            if (message.stockLookupRes != null && message.hasOwnProperty("stockLookupRes")) {
                object.stockLookupRes = $root.omnora.StockLookupResponse.toObject(message.stockLookupRes, options);
                if (options.oneofs)
                    object.payload = "stockLookupRes";
            }
            if (message.readReceipt != null && message.hasOwnProperty("readReceipt")) {
                object.readReceipt = $root.omnora.ReadReceipt.toObject(message.readReceipt, options);
                if (options.oneofs)
                    object.payload = "readReceipt";
            }
            if (message.presenceUpdate != null && message.hasOwnProperty("presenceUpdate")) {
                object.presenceUpdate = $root.omnora.PresenceUpdate.toObject(message.presenceUpdate, options);
                if (options.oneofs)
                    object.payload = "presenceUpdate";
            }
            if (message.ledgerSummaryReq != null && message.hasOwnProperty("ledgerSummaryReq")) {
                object.ledgerSummaryReq = $root.omnora.LedgerSummaryRequest.toObject(message.ledgerSummaryReq, options);
                if (options.oneofs)
                    object.payload = "ledgerSummaryReq";
            }
            if (message.ledgerSummaryRes != null && message.hasOwnProperty("ledgerSummaryRes")) {
                object.ledgerSummaryRes = $root.omnora.LedgerSummaryResponse.toObject(message.ledgerSummaryRes, options);
                if (options.oneofs)
                    object.payload = "ledgerSummaryRes";
            }
            if (message.partyBalanceReq != null && message.hasOwnProperty("partyBalanceReq")) {
                object.partyBalanceReq = $root.omnora.PartyBalanceRequest.toObject(message.partyBalanceReq, options);
                if (options.oneofs)
                    object.payload = "partyBalanceReq";
            }
            if (message.partyBalanceRes != null && message.hasOwnProperty("partyBalanceRes")) {
                object.partyBalanceRes = $root.omnora.PartyBalanceResponse.toObject(message.partyBalanceRes, options);
                if (options.oneofs)
                    object.payload = "partyBalanceRes";
            }
            if (message.invoiceSummaryReq != null && message.hasOwnProperty("invoiceSummaryReq")) {
                object.invoiceSummaryReq = $root.omnora.InvoiceSummaryRequest.toObject(message.invoiceSummaryReq, options);
                if (options.oneofs)
                    object.payload = "invoiceSummaryReq";
            }
            if (message.invoiceSummaryRes != null && message.hasOwnProperty("invoiceSummaryRes")) {
                object.invoiceSummaryRes = $root.omnora.InvoiceSummaryResponse.toObject(message.invoiceSummaryRes, options);
                if (options.oneofs)
                    object.payload = "invoiceSummaryRes";
            }
            if (message.paySlipReq != null && message.hasOwnProperty("paySlipReq")) {
                object.paySlipReq = $root.omnora.PaySlipRequest.toObject(message.paySlipReq, options);
                if (options.oneofs)
                    object.payload = "paySlipReq";
            }
            if (message.paySlipRes != null && message.hasOwnProperty("paySlipRes")) {
                object.paySlipRes = $root.omnora.PaySlipResponse.toObject(message.paySlipRes, options);
                if (options.oneofs)
                    object.payload = "paySlipRes";
            }
            if (message.branchListReq != null && message.hasOwnProperty("branchListReq")) {
                object.branchListReq = $root.omnora.BranchListRequest.toObject(message.branchListReq, options);
                if (options.oneofs)
                    object.payload = "branchListReq";
            }
            if (message.branchListRes != null && message.hasOwnProperty("branchListRes")) {
                object.branchListRes = $root.omnora.BranchListResponse.toObject(message.branchListRes, options);
                if (options.oneofs)
                    object.payload = "branchListRes";
            }
            if (message.switchBranchReq != null && message.hasOwnProperty("switchBranchReq")) {
                object.switchBranchReq = $root.omnora.SwitchBranchRequest.toObject(message.switchBranchReq, options);
                if (options.oneofs)
                    object.payload = "switchBranchReq";
            }
            if (message.switchBranchRes != null && message.hasOwnProperty("switchBranchRes")) {
                object.switchBranchRes = $root.omnora.SwitchBranchResponse.toObject(message.switchBranchRes, options);
                if (options.oneofs)
                    object.payload = "switchBranchRes";
            }
            if (message.detectionHistoryReq != null && message.hasOwnProperty("detectionHistoryReq")) {
                object.detectionHistoryReq = $root.omnora.DetectionHistoryRequest.toObject(message.detectionHistoryReq, options);
                if (options.oneofs)
                    object.payload = "detectionHistoryReq";
            }
            if (message.detectionHistoryRes != null && message.hasOwnProperty("detectionHistoryRes")) {
                object.detectionHistoryRes = $root.omnora.DetectionHistoryResponse.toObject(message.detectionHistoryRes, options);
                if (options.oneofs)
                    object.payload = "detectionHistoryRes";
            }
            if (message.cameraStatusReq != null && message.hasOwnProperty("cameraStatusReq")) {
                object.cameraStatusReq = $root.omnora.CameraStatusRequest.toObject(message.cameraStatusReq, options);
                if (options.oneofs)
                    object.payload = "cameraStatusReq";
            }
            if (message.cameraStatusRes != null && message.hasOwnProperty("cameraStatusRes")) {
                object.cameraStatusRes = $root.omnora.CameraStatusResponse.toObject(message.cameraStatusRes, options);
                if (options.oneofs)
                    object.payload = "cameraStatusRes";
            }
            return object;
        };

        /**
         * Converts this NspEnvelope to JSON.
         * @function toJSON
         * @memberof omnora.NspEnvelope
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        NspEnvelope.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return NspEnvelope;
    })();

    omnora.DetectionHistoryRequest = (function() {

        /**
         * Properties of a DetectionHistoryRequest.
         * @memberof omnora
         * @interface IDetectionHistoryRequest
         * @property {string|null} [nodeId] DetectionHistoryRequest nodeId
         * @property {string|null} [cameraNodeId] DetectionHistoryRequest cameraNodeId
         * @property {string|null} [detectedClass] DetectionHistoryRequest detectedClass
         * @property {number|Long|null} [sinceTimestamp] DetectionHistoryRequest sinceTimestamp
         * @property {number|null} [limit] DetectionHistoryRequest limit
         */

        /**
         * Constructs a new DetectionHistoryRequest.
         * @memberof omnora
         * @classdesc Represents a DetectionHistoryRequest.
         * @implements IDetectionHistoryRequest
         * @constructor
         * @param {omnora.IDetectionHistoryRequest=} [properties] Properties to set
         */
        function DetectionHistoryRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DetectionHistoryRequest nodeId.
         * @member {string} nodeId
         * @memberof omnora.DetectionHistoryRequest
         * @instance
         */
        DetectionHistoryRequest.prototype.nodeId = "";

        /**
         * DetectionHistoryRequest cameraNodeId.
         * @member {string} cameraNodeId
         * @memberof omnora.DetectionHistoryRequest
         * @instance
         */
        DetectionHistoryRequest.prototype.cameraNodeId = "";

        /**
         * DetectionHistoryRequest detectedClass.
         * @member {string} detectedClass
         * @memberof omnora.DetectionHistoryRequest
         * @instance
         */
        DetectionHistoryRequest.prototype.detectedClass = "";

        /**
         * DetectionHistoryRequest sinceTimestamp.
         * @member {number|Long} sinceTimestamp
         * @memberof omnora.DetectionHistoryRequest
         * @instance
         */
        DetectionHistoryRequest.prototype.sinceTimestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * DetectionHistoryRequest limit.
         * @member {number} limit
         * @memberof omnora.DetectionHistoryRequest
         * @instance
         */
        DetectionHistoryRequest.prototype.limit = 0;

        /**
         * Creates a new DetectionHistoryRequest instance using the specified properties.
         * @function create
         * @memberof omnora.DetectionHistoryRequest
         * @static
         * @param {omnora.IDetectionHistoryRequest=} [properties] Properties to set
         * @returns {omnora.DetectionHistoryRequest} DetectionHistoryRequest instance
         */
        DetectionHistoryRequest.create = function create(properties) {
            return new DetectionHistoryRequest(properties);
        };

        /**
         * Encodes the specified DetectionHistoryRequest message. Does not implicitly {@link omnora.DetectionHistoryRequest.verify|verify} messages.
         * @function encode
         * @memberof omnora.DetectionHistoryRequest
         * @static
         * @param {omnora.IDetectionHistoryRequest} message DetectionHistoryRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DetectionHistoryRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nodeId != null && Object.hasOwnProperty.call(message, "nodeId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.nodeId);
            if (message.cameraNodeId != null && Object.hasOwnProperty.call(message, "cameraNodeId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.cameraNodeId);
            if (message.detectedClass != null && Object.hasOwnProperty.call(message, "detectedClass"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.detectedClass);
            if (message.sinceTimestamp != null && Object.hasOwnProperty.call(message, "sinceTimestamp"))
                writer.uint32(/* id 4, wireType 0 =*/32).int64(message.sinceTimestamp);
            if (message.limit != null && Object.hasOwnProperty.call(message, "limit"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.limit);
            return writer;
        };

        /**
         * Encodes the specified DetectionHistoryRequest message, length delimited. Does not implicitly {@link omnora.DetectionHistoryRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.DetectionHistoryRequest
         * @static
         * @param {omnora.IDetectionHistoryRequest} message DetectionHistoryRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DetectionHistoryRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DetectionHistoryRequest message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.DetectionHistoryRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.DetectionHistoryRequest} DetectionHistoryRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DetectionHistoryRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.DetectionHistoryRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nodeId = reader.string();
                    break;
                case 2:
                    message.cameraNodeId = reader.string();
                    break;
                case 3:
                    message.detectedClass = reader.string();
                    break;
                case 4:
                    message.sinceTimestamp = reader.int64();
                    break;
                case 5:
                    message.limit = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DetectionHistoryRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.DetectionHistoryRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.DetectionHistoryRequest} DetectionHistoryRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DetectionHistoryRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DetectionHistoryRequest message.
         * @function verify
         * @memberof omnora.DetectionHistoryRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DetectionHistoryRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                if (!$util.isString(message.nodeId))
                    return "nodeId: string expected";
            if (message.cameraNodeId != null && message.hasOwnProperty("cameraNodeId"))
                if (!$util.isString(message.cameraNodeId))
                    return "cameraNodeId: string expected";
            if (message.detectedClass != null && message.hasOwnProperty("detectedClass"))
                if (!$util.isString(message.detectedClass))
                    return "detectedClass: string expected";
            if (message.sinceTimestamp != null && message.hasOwnProperty("sinceTimestamp"))
                if (!$util.isInteger(message.sinceTimestamp) && !(message.sinceTimestamp && $util.isInteger(message.sinceTimestamp.low) && $util.isInteger(message.sinceTimestamp.high)))
                    return "sinceTimestamp: integer|Long expected";
            if (message.limit != null && message.hasOwnProperty("limit"))
                if (!$util.isInteger(message.limit))
                    return "limit: integer expected";
            return null;
        };

        /**
         * Creates a DetectionHistoryRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.DetectionHistoryRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.DetectionHistoryRequest} DetectionHistoryRequest
         */
        DetectionHistoryRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.DetectionHistoryRequest)
                return object;
            var message = new $root.omnora.DetectionHistoryRequest();
            if (object.nodeId != null)
                message.nodeId = String(object.nodeId);
            if (object.cameraNodeId != null)
                message.cameraNodeId = String(object.cameraNodeId);
            if (object.detectedClass != null)
                message.detectedClass = String(object.detectedClass);
            if (object.sinceTimestamp != null)
                if ($util.Long)
                    (message.sinceTimestamp = $util.Long.fromValue(object.sinceTimestamp)).unsigned = false;
                else if (typeof object.sinceTimestamp === "string")
                    message.sinceTimestamp = parseInt(object.sinceTimestamp, 10);
                else if (typeof object.sinceTimestamp === "number")
                    message.sinceTimestamp = object.sinceTimestamp;
                else if (typeof object.sinceTimestamp === "object")
                    message.sinceTimestamp = new $util.LongBits(object.sinceTimestamp.low >>> 0, object.sinceTimestamp.high >>> 0).toNumber();
            if (object.limit != null)
                message.limit = object.limit | 0;
            return message;
        };

        /**
         * Creates a plain object from a DetectionHistoryRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.DetectionHistoryRequest
         * @static
         * @param {omnora.DetectionHistoryRequest} message DetectionHistoryRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DetectionHistoryRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.nodeId = "";
                object.cameraNodeId = "";
                object.detectedClass = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.sinceTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.sinceTimestamp = options.longs === String ? "0" : 0;
                object.limit = 0;
            }
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                object.nodeId = message.nodeId;
            if (message.cameraNodeId != null && message.hasOwnProperty("cameraNodeId"))
                object.cameraNodeId = message.cameraNodeId;
            if (message.detectedClass != null && message.hasOwnProperty("detectedClass"))
                object.detectedClass = message.detectedClass;
            if (message.sinceTimestamp != null && message.hasOwnProperty("sinceTimestamp"))
                if (typeof message.sinceTimestamp === "number")
                    object.sinceTimestamp = options.longs === String ? String(message.sinceTimestamp) : message.sinceTimestamp;
                else
                    object.sinceTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.sinceTimestamp) : options.longs === Number ? new $util.LongBits(message.sinceTimestamp.low >>> 0, message.sinceTimestamp.high >>> 0).toNumber() : message.sinceTimestamp;
            if (message.limit != null && message.hasOwnProperty("limit"))
                object.limit = message.limit;
            return object;
        };

        /**
         * Converts this DetectionHistoryRequest to JSON.
         * @function toJSON
         * @memberof omnora.DetectionHistoryRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DetectionHistoryRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DetectionHistoryRequest;
    })();

    omnora.DetectionHistoryResponse = (function() {

        /**
         * Properties of a DetectionHistoryResponse.
         * @memberof omnora
         * @interface IDetectionHistoryResponse
         * @property {Array.<omnora.IDetectionEvent>|null} [events] DetectionHistoryResponse events
         * @property {number|null} [totalCount] DetectionHistoryResponse totalCount
         */

        /**
         * Constructs a new DetectionHistoryResponse.
         * @memberof omnora
         * @classdesc Represents a DetectionHistoryResponse.
         * @implements IDetectionHistoryResponse
         * @constructor
         * @param {omnora.IDetectionHistoryResponse=} [properties] Properties to set
         */
        function DetectionHistoryResponse(properties) {
            this.events = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DetectionHistoryResponse events.
         * @member {Array.<omnora.IDetectionEvent>} events
         * @memberof omnora.DetectionHistoryResponse
         * @instance
         */
        DetectionHistoryResponse.prototype.events = $util.emptyArray;

        /**
         * DetectionHistoryResponse totalCount.
         * @member {number} totalCount
         * @memberof omnora.DetectionHistoryResponse
         * @instance
         */
        DetectionHistoryResponse.prototype.totalCount = 0;

        /**
         * Creates a new DetectionHistoryResponse instance using the specified properties.
         * @function create
         * @memberof omnora.DetectionHistoryResponse
         * @static
         * @param {omnora.IDetectionHistoryResponse=} [properties] Properties to set
         * @returns {omnora.DetectionHistoryResponse} DetectionHistoryResponse instance
         */
        DetectionHistoryResponse.create = function create(properties) {
            return new DetectionHistoryResponse(properties);
        };

        /**
         * Encodes the specified DetectionHistoryResponse message. Does not implicitly {@link omnora.DetectionHistoryResponse.verify|verify} messages.
         * @function encode
         * @memberof omnora.DetectionHistoryResponse
         * @static
         * @param {omnora.IDetectionHistoryResponse} message DetectionHistoryResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DetectionHistoryResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.events != null && message.events.length)
                for (var i = 0; i < message.events.length; ++i)
                    $root.omnora.DetectionEvent.encode(message.events[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.totalCount != null && Object.hasOwnProperty.call(message, "totalCount"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.totalCount);
            return writer;
        };

        /**
         * Encodes the specified DetectionHistoryResponse message, length delimited. Does not implicitly {@link omnora.DetectionHistoryResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.DetectionHistoryResponse
         * @static
         * @param {omnora.IDetectionHistoryResponse} message DetectionHistoryResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DetectionHistoryResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DetectionHistoryResponse message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.DetectionHistoryResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.DetectionHistoryResponse} DetectionHistoryResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DetectionHistoryResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.DetectionHistoryResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.events && message.events.length))
                        message.events = [];
                    message.events.push($root.omnora.DetectionEvent.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.totalCount = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DetectionHistoryResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.DetectionHistoryResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.DetectionHistoryResponse} DetectionHistoryResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DetectionHistoryResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DetectionHistoryResponse message.
         * @function verify
         * @memberof omnora.DetectionHistoryResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DetectionHistoryResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.events != null && message.hasOwnProperty("events")) {
                if (!Array.isArray(message.events))
                    return "events: array expected";
                for (var i = 0; i < message.events.length; ++i) {
                    var error = $root.omnora.DetectionEvent.verify(message.events[i]);
                    if (error)
                        return "events." + error;
                }
            }
            if (message.totalCount != null && message.hasOwnProperty("totalCount"))
                if (!$util.isInteger(message.totalCount))
                    return "totalCount: integer expected";
            return null;
        };

        /**
         * Creates a DetectionHistoryResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.DetectionHistoryResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.DetectionHistoryResponse} DetectionHistoryResponse
         */
        DetectionHistoryResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.DetectionHistoryResponse)
                return object;
            var message = new $root.omnora.DetectionHistoryResponse();
            if (object.events) {
                if (!Array.isArray(object.events))
                    throw TypeError(".omnora.DetectionHistoryResponse.events: array expected");
                message.events = [];
                for (var i = 0; i < object.events.length; ++i) {
                    if (typeof object.events[i] !== "object")
                        throw TypeError(".omnora.DetectionHistoryResponse.events: object expected");
                    message.events[i] = $root.omnora.DetectionEvent.fromObject(object.events[i]);
                }
            }
            if (object.totalCount != null)
                message.totalCount = object.totalCount | 0;
            return message;
        };

        /**
         * Creates a plain object from a DetectionHistoryResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.DetectionHistoryResponse
         * @static
         * @param {omnora.DetectionHistoryResponse} message DetectionHistoryResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DetectionHistoryResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.events = [];
            if (options.defaults)
                object.totalCount = 0;
            if (message.events && message.events.length) {
                object.events = [];
                for (var j = 0; j < message.events.length; ++j)
                    object.events[j] = $root.omnora.DetectionEvent.toObject(message.events[j], options);
            }
            if (message.totalCount != null && message.hasOwnProperty("totalCount"))
                object.totalCount = message.totalCount;
            return object;
        };

        /**
         * Converts this DetectionHistoryResponse to JSON.
         * @function toJSON
         * @memberof omnora.DetectionHistoryResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DetectionHistoryResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DetectionHistoryResponse;
    })();

    omnora.DetectionEvent = (function() {

        /**
         * Properties of a DetectionEvent.
         * @memberof omnora
         * @interface IDetectionEvent
         * @property {string|null} [eventId] DetectionEvent eventId
         * @property {string|null} [cameraLabel] DetectionEvent cameraLabel
         * @property {string|null} [installLocation] DetectionEvent installLocation
         * @property {string|null} [detectedClass] DetectionEvent detectedClass
         * @property {number|null} [confidence] DetectionEvent confidence
         * @property {string|null} [zoneId] DetectionEvent zoneId
         * @property {string|null} [zoneLabel] DetectionEvent zoneLabel
         * @property {number|Long|null} [createdAt] DetectionEvent createdAt
         * @property {string|null} [thumbnailUrl] DetectionEvent thumbnailUrl
         */

        /**
         * Constructs a new DetectionEvent.
         * @memberof omnora
         * @classdesc Represents a DetectionEvent.
         * @implements IDetectionEvent
         * @constructor
         * @param {omnora.IDetectionEvent=} [properties] Properties to set
         */
        function DetectionEvent(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DetectionEvent eventId.
         * @member {string} eventId
         * @memberof omnora.DetectionEvent
         * @instance
         */
        DetectionEvent.prototype.eventId = "";

        /**
         * DetectionEvent cameraLabel.
         * @member {string} cameraLabel
         * @memberof omnora.DetectionEvent
         * @instance
         */
        DetectionEvent.prototype.cameraLabel = "";

        /**
         * DetectionEvent installLocation.
         * @member {string} installLocation
         * @memberof omnora.DetectionEvent
         * @instance
         */
        DetectionEvent.prototype.installLocation = "";

        /**
         * DetectionEvent detectedClass.
         * @member {string} detectedClass
         * @memberof omnora.DetectionEvent
         * @instance
         */
        DetectionEvent.prototype.detectedClass = "";

        /**
         * DetectionEvent confidence.
         * @member {number} confidence
         * @memberof omnora.DetectionEvent
         * @instance
         */
        DetectionEvent.prototype.confidence = 0;

        /**
         * DetectionEvent zoneId.
         * @member {string} zoneId
         * @memberof omnora.DetectionEvent
         * @instance
         */
        DetectionEvent.prototype.zoneId = "";

        /**
         * DetectionEvent zoneLabel.
         * @member {string} zoneLabel
         * @memberof omnora.DetectionEvent
         * @instance
         */
        DetectionEvent.prototype.zoneLabel = "";

        /**
         * DetectionEvent createdAt.
         * @member {number|Long} createdAt
         * @memberof omnora.DetectionEvent
         * @instance
         */
        DetectionEvent.prototype.createdAt = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * DetectionEvent thumbnailUrl.
         * @member {string} thumbnailUrl
         * @memberof omnora.DetectionEvent
         * @instance
         */
        DetectionEvent.prototype.thumbnailUrl = "";

        /**
         * Creates a new DetectionEvent instance using the specified properties.
         * @function create
         * @memberof omnora.DetectionEvent
         * @static
         * @param {omnora.IDetectionEvent=} [properties] Properties to set
         * @returns {omnora.DetectionEvent} DetectionEvent instance
         */
        DetectionEvent.create = function create(properties) {
            return new DetectionEvent(properties);
        };

        /**
         * Encodes the specified DetectionEvent message. Does not implicitly {@link omnora.DetectionEvent.verify|verify} messages.
         * @function encode
         * @memberof omnora.DetectionEvent
         * @static
         * @param {omnora.IDetectionEvent} message DetectionEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DetectionEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.eventId != null && Object.hasOwnProperty.call(message, "eventId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.eventId);
            if (message.cameraLabel != null && Object.hasOwnProperty.call(message, "cameraLabel"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.cameraLabel);
            if (message.installLocation != null && Object.hasOwnProperty.call(message, "installLocation"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.installLocation);
            if (message.detectedClass != null && Object.hasOwnProperty.call(message, "detectedClass"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.detectedClass);
            if (message.confidence != null && Object.hasOwnProperty.call(message, "confidence"))
                writer.uint32(/* id 5, wireType 5 =*/45).float(message.confidence);
            if (message.zoneId != null && Object.hasOwnProperty.call(message, "zoneId"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.zoneId);
            if (message.zoneLabel != null && Object.hasOwnProperty.call(message, "zoneLabel"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.zoneLabel);
            if (message.createdAt != null && Object.hasOwnProperty.call(message, "createdAt"))
                writer.uint32(/* id 8, wireType 0 =*/64).int64(message.createdAt);
            if (message.thumbnailUrl != null && Object.hasOwnProperty.call(message, "thumbnailUrl"))
                writer.uint32(/* id 9, wireType 2 =*/74).string(message.thumbnailUrl);
            return writer;
        };

        /**
         * Encodes the specified DetectionEvent message, length delimited. Does not implicitly {@link omnora.DetectionEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.DetectionEvent
         * @static
         * @param {omnora.IDetectionEvent} message DetectionEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DetectionEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DetectionEvent message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.DetectionEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.DetectionEvent} DetectionEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DetectionEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.DetectionEvent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.eventId = reader.string();
                    break;
                case 2:
                    message.cameraLabel = reader.string();
                    break;
                case 3:
                    message.installLocation = reader.string();
                    break;
                case 4:
                    message.detectedClass = reader.string();
                    break;
                case 5:
                    message.confidence = reader.float();
                    break;
                case 6:
                    message.zoneId = reader.string();
                    break;
                case 7:
                    message.zoneLabel = reader.string();
                    break;
                case 8:
                    message.createdAt = reader.int64();
                    break;
                case 9:
                    message.thumbnailUrl = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DetectionEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.DetectionEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.DetectionEvent} DetectionEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DetectionEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DetectionEvent message.
         * @function verify
         * @memberof omnora.DetectionEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DetectionEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.eventId != null && message.hasOwnProperty("eventId"))
                if (!$util.isString(message.eventId))
                    return "eventId: string expected";
            if (message.cameraLabel != null && message.hasOwnProperty("cameraLabel"))
                if (!$util.isString(message.cameraLabel))
                    return "cameraLabel: string expected";
            if (message.installLocation != null && message.hasOwnProperty("installLocation"))
                if (!$util.isString(message.installLocation))
                    return "installLocation: string expected";
            if (message.detectedClass != null && message.hasOwnProperty("detectedClass"))
                if (!$util.isString(message.detectedClass))
                    return "detectedClass: string expected";
            if (message.confidence != null && message.hasOwnProperty("confidence"))
                if (typeof message.confidence !== "number")
                    return "confidence: number expected";
            if (message.zoneId != null && message.hasOwnProperty("zoneId"))
                if (!$util.isString(message.zoneId))
                    return "zoneId: string expected";
            if (message.zoneLabel != null && message.hasOwnProperty("zoneLabel"))
                if (!$util.isString(message.zoneLabel))
                    return "zoneLabel: string expected";
            if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                if (!$util.isInteger(message.createdAt) && !(message.createdAt && $util.isInteger(message.createdAt.low) && $util.isInteger(message.createdAt.high)))
                    return "createdAt: integer|Long expected";
            if (message.thumbnailUrl != null && message.hasOwnProperty("thumbnailUrl"))
                if (!$util.isString(message.thumbnailUrl))
                    return "thumbnailUrl: string expected";
            return null;
        };

        /**
         * Creates a DetectionEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.DetectionEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.DetectionEvent} DetectionEvent
         */
        DetectionEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.DetectionEvent)
                return object;
            var message = new $root.omnora.DetectionEvent();
            if (object.eventId != null)
                message.eventId = String(object.eventId);
            if (object.cameraLabel != null)
                message.cameraLabel = String(object.cameraLabel);
            if (object.installLocation != null)
                message.installLocation = String(object.installLocation);
            if (object.detectedClass != null)
                message.detectedClass = String(object.detectedClass);
            if (object.confidence != null)
                message.confidence = Number(object.confidence);
            if (object.zoneId != null)
                message.zoneId = String(object.zoneId);
            if (object.zoneLabel != null)
                message.zoneLabel = String(object.zoneLabel);
            if (object.createdAt != null)
                if ($util.Long)
                    (message.createdAt = $util.Long.fromValue(object.createdAt)).unsigned = false;
                else if (typeof object.createdAt === "string")
                    message.createdAt = parseInt(object.createdAt, 10);
                else if (typeof object.createdAt === "number")
                    message.createdAt = object.createdAt;
                else if (typeof object.createdAt === "object")
                    message.createdAt = new $util.LongBits(object.createdAt.low >>> 0, object.createdAt.high >>> 0).toNumber();
            if (object.thumbnailUrl != null)
                message.thumbnailUrl = String(object.thumbnailUrl);
            return message;
        };

        /**
         * Creates a plain object from a DetectionEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.DetectionEvent
         * @static
         * @param {omnora.DetectionEvent} message DetectionEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DetectionEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.eventId = "";
                object.cameraLabel = "";
                object.installLocation = "";
                object.detectedClass = "";
                object.confidence = 0;
                object.zoneId = "";
                object.zoneLabel = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.createdAt = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.createdAt = options.longs === String ? "0" : 0;
                object.thumbnailUrl = "";
            }
            if (message.eventId != null && message.hasOwnProperty("eventId"))
                object.eventId = message.eventId;
            if (message.cameraLabel != null && message.hasOwnProperty("cameraLabel"))
                object.cameraLabel = message.cameraLabel;
            if (message.installLocation != null && message.hasOwnProperty("installLocation"))
                object.installLocation = message.installLocation;
            if (message.detectedClass != null && message.hasOwnProperty("detectedClass"))
                object.detectedClass = message.detectedClass;
            if (message.confidence != null && message.hasOwnProperty("confidence"))
                object.confidence = options.json && !isFinite(message.confidence) ? String(message.confidence) : message.confidence;
            if (message.zoneId != null && message.hasOwnProperty("zoneId"))
                object.zoneId = message.zoneId;
            if (message.zoneLabel != null && message.hasOwnProperty("zoneLabel"))
                object.zoneLabel = message.zoneLabel;
            if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                if (typeof message.createdAt === "number")
                    object.createdAt = options.longs === String ? String(message.createdAt) : message.createdAt;
                else
                    object.createdAt = options.longs === String ? $util.Long.prototype.toString.call(message.createdAt) : options.longs === Number ? new $util.LongBits(message.createdAt.low >>> 0, message.createdAt.high >>> 0).toNumber() : message.createdAt;
            if (message.thumbnailUrl != null && message.hasOwnProperty("thumbnailUrl"))
                object.thumbnailUrl = message.thumbnailUrl;
            return object;
        };

        /**
         * Converts this DetectionEvent to JSON.
         * @function toJSON
         * @memberof omnora.DetectionEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DetectionEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DetectionEvent;
    })();

    omnora.CameraStatusRequest = (function() {

        /**
         * Properties of a CameraStatusRequest.
         * @memberof omnora
         * @interface ICameraStatusRequest
         * @property {string|null} [nodeId] CameraStatusRequest nodeId
         */

        /**
         * Constructs a new CameraStatusRequest.
         * @memberof omnora
         * @classdesc Represents a CameraStatusRequest.
         * @implements ICameraStatusRequest
         * @constructor
         * @param {omnora.ICameraStatusRequest=} [properties] Properties to set
         */
        function CameraStatusRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CameraStatusRequest nodeId.
         * @member {string} nodeId
         * @memberof omnora.CameraStatusRequest
         * @instance
         */
        CameraStatusRequest.prototype.nodeId = "";

        /**
         * Creates a new CameraStatusRequest instance using the specified properties.
         * @function create
         * @memberof omnora.CameraStatusRequest
         * @static
         * @param {omnora.ICameraStatusRequest=} [properties] Properties to set
         * @returns {omnora.CameraStatusRequest} CameraStatusRequest instance
         */
        CameraStatusRequest.create = function create(properties) {
            return new CameraStatusRequest(properties);
        };

        /**
         * Encodes the specified CameraStatusRequest message. Does not implicitly {@link omnora.CameraStatusRequest.verify|verify} messages.
         * @function encode
         * @memberof omnora.CameraStatusRequest
         * @static
         * @param {omnora.ICameraStatusRequest} message CameraStatusRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CameraStatusRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nodeId != null && Object.hasOwnProperty.call(message, "nodeId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.nodeId);
            return writer;
        };

        /**
         * Encodes the specified CameraStatusRequest message, length delimited. Does not implicitly {@link omnora.CameraStatusRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.CameraStatusRequest
         * @static
         * @param {omnora.ICameraStatusRequest} message CameraStatusRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CameraStatusRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CameraStatusRequest message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.CameraStatusRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.CameraStatusRequest} CameraStatusRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CameraStatusRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.CameraStatusRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nodeId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CameraStatusRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.CameraStatusRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.CameraStatusRequest} CameraStatusRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CameraStatusRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CameraStatusRequest message.
         * @function verify
         * @memberof omnora.CameraStatusRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CameraStatusRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                if (!$util.isString(message.nodeId))
                    return "nodeId: string expected";
            return null;
        };

        /**
         * Creates a CameraStatusRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.CameraStatusRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.CameraStatusRequest} CameraStatusRequest
         */
        CameraStatusRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.CameraStatusRequest)
                return object;
            var message = new $root.omnora.CameraStatusRequest();
            if (object.nodeId != null)
                message.nodeId = String(object.nodeId);
            return message;
        };

        /**
         * Creates a plain object from a CameraStatusRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.CameraStatusRequest
         * @static
         * @param {omnora.CameraStatusRequest} message CameraStatusRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CameraStatusRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.nodeId = "";
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                object.nodeId = message.nodeId;
            return object;
        };

        /**
         * Converts this CameraStatusRequest to JSON.
         * @function toJSON
         * @memberof omnora.CameraStatusRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CameraStatusRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CameraStatusRequest;
    })();

    omnora.CameraStatusResponse = (function() {

        /**
         * Properties of a CameraStatusResponse.
         * @memberof omnora
         * @interface ICameraStatusResponse
         * @property {Array.<omnora.ICameraStatusItem>|null} [cameras] CameraStatusResponse cameras
         */

        /**
         * Constructs a new CameraStatusResponse.
         * @memberof omnora
         * @classdesc Represents a CameraStatusResponse.
         * @implements ICameraStatusResponse
         * @constructor
         * @param {omnora.ICameraStatusResponse=} [properties] Properties to set
         */
        function CameraStatusResponse(properties) {
            this.cameras = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CameraStatusResponse cameras.
         * @member {Array.<omnora.ICameraStatusItem>} cameras
         * @memberof omnora.CameraStatusResponse
         * @instance
         */
        CameraStatusResponse.prototype.cameras = $util.emptyArray;

        /**
         * Creates a new CameraStatusResponse instance using the specified properties.
         * @function create
         * @memberof omnora.CameraStatusResponse
         * @static
         * @param {omnora.ICameraStatusResponse=} [properties] Properties to set
         * @returns {omnora.CameraStatusResponse} CameraStatusResponse instance
         */
        CameraStatusResponse.create = function create(properties) {
            return new CameraStatusResponse(properties);
        };

        /**
         * Encodes the specified CameraStatusResponse message. Does not implicitly {@link omnora.CameraStatusResponse.verify|verify} messages.
         * @function encode
         * @memberof omnora.CameraStatusResponse
         * @static
         * @param {omnora.ICameraStatusResponse} message CameraStatusResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CameraStatusResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cameras != null && message.cameras.length)
                for (var i = 0; i < message.cameras.length; ++i)
                    $root.omnora.CameraStatusItem.encode(message.cameras[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified CameraStatusResponse message, length delimited. Does not implicitly {@link omnora.CameraStatusResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.CameraStatusResponse
         * @static
         * @param {omnora.ICameraStatusResponse} message CameraStatusResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CameraStatusResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CameraStatusResponse message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.CameraStatusResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.CameraStatusResponse} CameraStatusResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CameraStatusResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.CameraStatusResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.cameras && message.cameras.length))
                        message.cameras = [];
                    message.cameras.push($root.omnora.CameraStatusItem.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CameraStatusResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.CameraStatusResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.CameraStatusResponse} CameraStatusResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CameraStatusResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CameraStatusResponse message.
         * @function verify
         * @memberof omnora.CameraStatusResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CameraStatusResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cameras != null && message.hasOwnProperty("cameras")) {
                if (!Array.isArray(message.cameras))
                    return "cameras: array expected";
                for (var i = 0; i < message.cameras.length; ++i) {
                    var error = $root.omnora.CameraStatusItem.verify(message.cameras[i]);
                    if (error)
                        return "cameras." + error;
                }
            }
            return null;
        };

        /**
         * Creates a CameraStatusResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.CameraStatusResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.CameraStatusResponse} CameraStatusResponse
         */
        CameraStatusResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.CameraStatusResponse)
                return object;
            var message = new $root.omnora.CameraStatusResponse();
            if (object.cameras) {
                if (!Array.isArray(object.cameras))
                    throw TypeError(".omnora.CameraStatusResponse.cameras: array expected");
                message.cameras = [];
                for (var i = 0; i < object.cameras.length; ++i) {
                    if (typeof object.cameras[i] !== "object")
                        throw TypeError(".omnora.CameraStatusResponse.cameras: object expected");
                    message.cameras[i] = $root.omnora.CameraStatusItem.fromObject(object.cameras[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a CameraStatusResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.CameraStatusResponse
         * @static
         * @param {omnora.CameraStatusResponse} message CameraStatusResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CameraStatusResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.cameras = [];
            if (message.cameras && message.cameras.length) {
                object.cameras = [];
                for (var j = 0; j < message.cameras.length; ++j)
                    object.cameras[j] = $root.omnora.CameraStatusItem.toObject(message.cameras[j], options);
            }
            return object;
        };

        /**
         * Converts this CameraStatusResponse to JSON.
         * @function toJSON
         * @memberof omnora.CameraStatusResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CameraStatusResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CameraStatusResponse;
    })();

    omnora.CameraStatusItem = (function() {

        /**
         * Properties of a CameraStatusItem.
         * @memberof omnora
         * @interface ICameraStatusItem
         * @property {string|null} [cameraId] CameraStatusItem cameraId
         * @property {string|null} [label] CameraStatusItem label
         * @property {string|null} [location] CameraStatusItem location
         * @property {string|null} [brand] CameraStatusItem brand
         * @property {string|null} [modelNumber] CameraStatusItem modelNumber
         * @property {string|null} [status] CameraStatusItem status
         * @property {number|Long|null} [lastFrameAt] CameraStatusItem lastFrameAt
         * @property {number|null} [bitrateKbps] CameraStatusItem bitrateKbps
         * @property {number|null} [avgBrightness] CameraStatusItem avgBrightness
         * @property {boolean|null} [aiEnabled] CameraStatusItem aiEnabled
         * @property {string|null} [activeFault] CameraStatusItem activeFault
         */

        /**
         * Constructs a new CameraStatusItem.
         * @memberof omnora
         * @classdesc Represents a CameraStatusItem.
         * @implements ICameraStatusItem
         * @constructor
         * @param {omnora.ICameraStatusItem=} [properties] Properties to set
         */
        function CameraStatusItem(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CameraStatusItem cameraId.
         * @member {string} cameraId
         * @memberof omnora.CameraStatusItem
         * @instance
         */
        CameraStatusItem.prototype.cameraId = "";

        /**
         * CameraStatusItem label.
         * @member {string} label
         * @memberof omnora.CameraStatusItem
         * @instance
         */
        CameraStatusItem.prototype.label = "";

        /**
         * CameraStatusItem location.
         * @member {string} location
         * @memberof omnora.CameraStatusItem
         * @instance
         */
        CameraStatusItem.prototype.location = "";

        /**
         * CameraStatusItem brand.
         * @member {string} brand
         * @memberof omnora.CameraStatusItem
         * @instance
         */
        CameraStatusItem.prototype.brand = "";

        /**
         * CameraStatusItem modelNumber.
         * @member {string} modelNumber
         * @memberof omnora.CameraStatusItem
         * @instance
         */
        CameraStatusItem.prototype.modelNumber = "";

        /**
         * CameraStatusItem status.
         * @member {string} status
         * @memberof omnora.CameraStatusItem
         * @instance
         */
        CameraStatusItem.prototype.status = "";

        /**
         * CameraStatusItem lastFrameAt.
         * @member {number|Long} lastFrameAt
         * @memberof omnora.CameraStatusItem
         * @instance
         */
        CameraStatusItem.prototype.lastFrameAt = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * CameraStatusItem bitrateKbps.
         * @member {number} bitrateKbps
         * @memberof omnora.CameraStatusItem
         * @instance
         */
        CameraStatusItem.prototype.bitrateKbps = 0;

        /**
         * CameraStatusItem avgBrightness.
         * @member {number} avgBrightness
         * @memberof omnora.CameraStatusItem
         * @instance
         */
        CameraStatusItem.prototype.avgBrightness = 0;

        /**
         * CameraStatusItem aiEnabled.
         * @member {boolean} aiEnabled
         * @memberof omnora.CameraStatusItem
         * @instance
         */
        CameraStatusItem.prototype.aiEnabled = false;

        /**
         * CameraStatusItem activeFault.
         * @member {string} activeFault
         * @memberof omnora.CameraStatusItem
         * @instance
         */
        CameraStatusItem.prototype.activeFault = "";

        /**
         * Creates a new CameraStatusItem instance using the specified properties.
         * @function create
         * @memberof omnora.CameraStatusItem
         * @static
         * @param {omnora.ICameraStatusItem=} [properties] Properties to set
         * @returns {omnora.CameraStatusItem} CameraStatusItem instance
         */
        CameraStatusItem.create = function create(properties) {
            return new CameraStatusItem(properties);
        };

        /**
         * Encodes the specified CameraStatusItem message. Does not implicitly {@link omnora.CameraStatusItem.verify|verify} messages.
         * @function encode
         * @memberof omnora.CameraStatusItem
         * @static
         * @param {omnora.ICameraStatusItem} message CameraStatusItem message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CameraStatusItem.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cameraId != null && Object.hasOwnProperty.call(message, "cameraId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.cameraId);
            if (message.label != null && Object.hasOwnProperty.call(message, "label"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.label);
            if (message.location != null && Object.hasOwnProperty.call(message, "location"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.location);
            if (message.brand != null && Object.hasOwnProperty.call(message, "brand"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.brand);
            if (message.modelNumber != null && Object.hasOwnProperty.call(message, "modelNumber"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.modelNumber);
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.status);
            if (message.lastFrameAt != null && Object.hasOwnProperty.call(message, "lastFrameAt"))
                writer.uint32(/* id 7, wireType 0 =*/56).int64(message.lastFrameAt);
            if (message.bitrateKbps != null && Object.hasOwnProperty.call(message, "bitrateKbps"))
                writer.uint32(/* id 8, wireType 5 =*/69).float(message.bitrateKbps);
            if (message.avgBrightness != null && Object.hasOwnProperty.call(message, "avgBrightness"))
                writer.uint32(/* id 9, wireType 5 =*/77).float(message.avgBrightness);
            if (message.aiEnabled != null && Object.hasOwnProperty.call(message, "aiEnabled"))
                writer.uint32(/* id 10, wireType 0 =*/80).bool(message.aiEnabled);
            if (message.activeFault != null && Object.hasOwnProperty.call(message, "activeFault"))
                writer.uint32(/* id 11, wireType 2 =*/90).string(message.activeFault);
            return writer;
        };

        /**
         * Encodes the specified CameraStatusItem message, length delimited. Does not implicitly {@link omnora.CameraStatusItem.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.CameraStatusItem
         * @static
         * @param {omnora.ICameraStatusItem} message CameraStatusItem message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CameraStatusItem.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CameraStatusItem message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.CameraStatusItem
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.CameraStatusItem} CameraStatusItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CameraStatusItem.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.CameraStatusItem();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.cameraId = reader.string();
                    break;
                case 2:
                    message.label = reader.string();
                    break;
                case 3:
                    message.location = reader.string();
                    break;
                case 4:
                    message.brand = reader.string();
                    break;
                case 5:
                    message.modelNumber = reader.string();
                    break;
                case 6:
                    message.status = reader.string();
                    break;
                case 7:
                    message.lastFrameAt = reader.int64();
                    break;
                case 8:
                    message.bitrateKbps = reader.float();
                    break;
                case 9:
                    message.avgBrightness = reader.float();
                    break;
                case 10:
                    message.aiEnabled = reader.bool();
                    break;
                case 11:
                    message.activeFault = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CameraStatusItem message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.CameraStatusItem
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.CameraStatusItem} CameraStatusItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CameraStatusItem.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CameraStatusItem message.
         * @function verify
         * @memberof omnora.CameraStatusItem
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CameraStatusItem.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cameraId != null && message.hasOwnProperty("cameraId"))
                if (!$util.isString(message.cameraId))
                    return "cameraId: string expected";
            if (message.label != null && message.hasOwnProperty("label"))
                if (!$util.isString(message.label))
                    return "label: string expected";
            if (message.location != null && message.hasOwnProperty("location"))
                if (!$util.isString(message.location))
                    return "location: string expected";
            if (message.brand != null && message.hasOwnProperty("brand"))
                if (!$util.isString(message.brand))
                    return "brand: string expected";
            if (message.modelNumber != null && message.hasOwnProperty("modelNumber"))
                if (!$util.isString(message.modelNumber))
                    return "modelNumber: string expected";
            if (message.status != null && message.hasOwnProperty("status"))
                if (!$util.isString(message.status))
                    return "status: string expected";
            if (message.lastFrameAt != null && message.hasOwnProperty("lastFrameAt"))
                if (!$util.isInteger(message.lastFrameAt) && !(message.lastFrameAt && $util.isInteger(message.lastFrameAt.low) && $util.isInteger(message.lastFrameAt.high)))
                    return "lastFrameAt: integer|Long expected";
            if (message.bitrateKbps != null && message.hasOwnProperty("bitrateKbps"))
                if (typeof message.bitrateKbps !== "number")
                    return "bitrateKbps: number expected";
            if (message.avgBrightness != null && message.hasOwnProperty("avgBrightness"))
                if (typeof message.avgBrightness !== "number")
                    return "avgBrightness: number expected";
            if (message.aiEnabled != null && message.hasOwnProperty("aiEnabled"))
                if (typeof message.aiEnabled !== "boolean")
                    return "aiEnabled: boolean expected";
            if (message.activeFault != null && message.hasOwnProperty("activeFault"))
                if (!$util.isString(message.activeFault))
                    return "activeFault: string expected";
            return null;
        };

        /**
         * Creates a CameraStatusItem message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.CameraStatusItem
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.CameraStatusItem} CameraStatusItem
         */
        CameraStatusItem.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.CameraStatusItem)
                return object;
            var message = new $root.omnora.CameraStatusItem();
            if (object.cameraId != null)
                message.cameraId = String(object.cameraId);
            if (object.label != null)
                message.label = String(object.label);
            if (object.location != null)
                message.location = String(object.location);
            if (object.brand != null)
                message.brand = String(object.brand);
            if (object.modelNumber != null)
                message.modelNumber = String(object.modelNumber);
            if (object.status != null)
                message.status = String(object.status);
            if (object.lastFrameAt != null)
                if ($util.Long)
                    (message.lastFrameAt = $util.Long.fromValue(object.lastFrameAt)).unsigned = false;
                else if (typeof object.lastFrameAt === "string")
                    message.lastFrameAt = parseInt(object.lastFrameAt, 10);
                else if (typeof object.lastFrameAt === "number")
                    message.lastFrameAt = object.lastFrameAt;
                else if (typeof object.lastFrameAt === "object")
                    message.lastFrameAt = new $util.LongBits(object.lastFrameAt.low >>> 0, object.lastFrameAt.high >>> 0).toNumber();
            if (object.bitrateKbps != null)
                message.bitrateKbps = Number(object.bitrateKbps);
            if (object.avgBrightness != null)
                message.avgBrightness = Number(object.avgBrightness);
            if (object.aiEnabled != null)
                message.aiEnabled = Boolean(object.aiEnabled);
            if (object.activeFault != null)
                message.activeFault = String(object.activeFault);
            return message;
        };

        /**
         * Creates a plain object from a CameraStatusItem message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.CameraStatusItem
         * @static
         * @param {omnora.CameraStatusItem} message CameraStatusItem
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CameraStatusItem.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.cameraId = "";
                object.label = "";
                object.location = "";
                object.brand = "";
                object.modelNumber = "";
                object.status = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.lastFrameAt = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.lastFrameAt = options.longs === String ? "0" : 0;
                object.bitrateKbps = 0;
                object.avgBrightness = 0;
                object.aiEnabled = false;
                object.activeFault = "";
            }
            if (message.cameraId != null && message.hasOwnProperty("cameraId"))
                object.cameraId = message.cameraId;
            if (message.label != null && message.hasOwnProperty("label"))
                object.label = message.label;
            if (message.location != null && message.hasOwnProperty("location"))
                object.location = message.location;
            if (message.brand != null && message.hasOwnProperty("brand"))
                object.brand = message.brand;
            if (message.modelNumber != null && message.hasOwnProperty("modelNumber"))
                object.modelNumber = message.modelNumber;
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = message.status;
            if (message.lastFrameAt != null && message.hasOwnProperty("lastFrameAt"))
                if (typeof message.lastFrameAt === "number")
                    object.lastFrameAt = options.longs === String ? String(message.lastFrameAt) : message.lastFrameAt;
                else
                    object.lastFrameAt = options.longs === String ? $util.Long.prototype.toString.call(message.lastFrameAt) : options.longs === Number ? new $util.LongBits(message.lastFrameAt.low >>> 0, message.lastFrameAt.high >>> 0).toNumber() : message.lastFrameAt;
            if (message.bitrateKbps != null && message.hasOwnProperty("bitrateKbps"))
                object.bitrateKbps = options.json && !isFinite(message.bitrateKbps) ? String(message.bitrateKbps) : message.bitrateKbps;
            if (message.avgBrightness != null && message.hasOwnProperty("avgBrightness"))
                object.avgBrightness = options.json && !isFinite(message.avgBrightness) ? String(message.avgBrightness) : message.avgBrightness;
            if (message.aiEnabled != null && message.hasOwnProperty("aiEnabled"))
                object.aiEnabled = message.aiEnabled;
            if (message.activeFault != null && message.hasOwnProperty("activeFault"))
                object.activeFault = message.activeFault;
            return object;
        };

        /**
         * Converts this CameraStatusItem to JSON.
         * @function toJSON
         * @memberof omnora.CameraStatusItem
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CameraStatusItem.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CameraStatusItem;
    })();

    omnora.LedgerSummaryRequest = (function() {

        /**
         * Properties of a LedgerSummaryRequest.
         * @memberof omnora
         * @interface ILedgerSummaryRequest
         * @property {string|null} [nodeId] LedgerSummaryRequest nodeId
         * @property {string|null} [dateFrom] LedgerSummaryRequest dateFrom
         * @property {string|null} [dateTo] LedgerSummaryRequest dateTo
         * @property {number|null} [limit] LedgerSummaryRequest limit
         */

        /**
         * Constructs a new LedgerSummaryRequest.
         * @memberof omnora
         * @classdesc Represents a LedgerSummaryRequest.
         * @implements ILedgerSummaryRequest
         * @constructor
         * @param {omnora.ILedgerSummaryRequest=} [properties] Properties to set
         */
        function LedgerSummaryRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LedgerSummaryRequest nodeId.
         * @member {string} nodeId
         * @memberof omnora.LedgerSummaryRequest
         * @instance
         */
        LedgerSummaryRequest.prototype.nodeId = "";

        /**
         * LedgerSummaryRequest dateFrom.
         * @member {string} dateFrom
         * @memberof omnora.LedgerSummaryRequest
         * @instance
         */
        LedgerSummaryRequest.prototype.dateFrom = "";

        /**
         * LedgerSummaryRequest dateTo.
         * @member {string} dateTo
         * @memberof omnora.LedgerSummaryRequest
         * @instance
         */
        LedgerSummaryRequest.prototype.dateTo = "";

        /**
         * LedgerSummaryRequest limit.
         * @member {number} limit
         * @memberof omnora.LedgerSummaryRequest
         * @instance
         */
        LedgerSummaryRequest.prototype.limit = 0;

        /**
         * Creates a new LedgerSummaryRequest instance using the specified properties.
         * @function create
         * @memberof omnora.LedgerSummaryRequest
         * @static
         * @param {omnora.ILedgerSummaryRequest=} [properties] Properties to set
         * @returns {omnora.LedgerSummaryRequest} LedgerSummaryRequest instance
         */
        LedgerSummaryRequest.create = function create(properties) {
            return new LedgerSummaryRequest(properties);
        };

        /**
         * Encodes the specified LedgerSummaryRequest message. Does not implicitly {@link omnora.LedgerSummaryRequest.verify|verify} messages.
         * @function encode
         * @memberof omnora.LedgerSummaryRequest
         * @static
         * @param {omnora.ILedgerSummaryRequest} message LedgerSummaryRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LedgerSummaryRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nodeId != null && Object.hasOwnProperty.call(message, "nodeId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.nodeId);
            if (message.dateFrom != null && Object.hasOwnProperty.call(message, "dateFrom"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.dateFrom);
            if (message.dateTo != null && Object.hasOwnProperty.call(message, "dateTo"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.dateTo);
            if (message.limit != null && Object.hasOwnProperty.call(message, "limit"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.limit);
            return writer;
        };

        /**
         * Encodes the specified LedgerSummaryRequest message, length delimited. Does not implicitly {@link omnora.LedgerSummaryRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.LedgerSummaryRequest
         * @static
         * @param {omnora.ILedgerSummaryRequest} message LedgerSummaryRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LedgerSummaryRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LedgerSummaryRequest message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.LedgerSummaryRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.LedgerSummaryRequest} LedgerSummaryRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LedgerSummaryRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.LedgerSummaryRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nodeId = reader.string();
                    break;
                case 2:
                    message.dateFrom = reader.string();
                    break;
                case 3:
                    message.dateTo = reader.string();
                    break;
                case 4:
                    message.limit = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LedgerSummaryRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.LedgerSummaryRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.LedgerSummaryRequest} LedgerSummaryRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LedgerSummaryRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LedgerSummaryRequest message.
         * @function verify
         * @memberof omnora.LedgerSummaryRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LedgerSummaryRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                if (!$util.isString(message.nodeId))
                    return "nodeId: string expected";
            if (message.dateFrom != null && message.hasOwnProperty("dateFrom"))
                if (!$util.isString(message.dateFrom))
                    return "dateFrom: string expected";
            if (message.dateTo != null && message.hasOwnProperty("dateTo"))
                if (!$util.isString(message.dateTo))
                    return "dateTo: string expected";
            if (message.limit != null && message.hasOwnProperty("limit"))
                if (!$util.isInteger(message.limit))
                    return "limit: integer expected";
            return null;
        };

        /**
         * Creates a LedgerSummaryRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.LedgerSummaryRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.LedgerSummaryRequest} LedgerSummaryRequest
         */
        LedgerSummaryRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.LedgerSummaryRequest)
                return object;
            var message = new $root.omnora.LedgerSummaryRequest();
            if (object.nodeId != null)
                message.nodeId = String(object.nodeId);
            if (object.dateFrom != null)
                message.dateFrom = String(object.dateFrom);
            if (object.dateTo != null)
                message.dateTo = String(object.dateTo);
            if (object.limit != null)
                message.limit = object.limit | 0;
            return message;
        };

        /**
         * Creates a plain object from a LedgerSummaryRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.LedgerSummaryRequest
         * @static
         * @param {omnora.LedgerSummaryRequest} message LedgerSummaryRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LedgerSummaryRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.nodeId = "";
                object.dateFrom = "";
                object.dateTo = "";
                object.limit = 0;
            }
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                object.nodeId = message.nodeId;
            if (message.dateFrom != null && message.hasOwnProperty("dateFrom"))
                object.dateFrom = message.dateFrom;
            if (message.dateTo != null && message.hasOwnProperty("dateTo"))
                object.dateTo = message.dateTo;
            if (message.limit != null && message.hasOwnProperty("limit"))
                object.limit = message.limit;
            return object;
        };

        /**
         * Converts this LedgerSummaryRequest to JSON.
         * @function toJSON
         * @memberof omnora.LedgerSummaryRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LedgerSummaryRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return LedgerSummaryRequest;
    })();

    omnora.LedgerSummaryResponse = (function() {

        /**
         * Properties of a LedgerSummaryResponse.
         * @memberof omnora
         * @interface ILedgerSummaryResponse
         * @property {Array.<omnora.ILedgerEntryItem>|null} [entries] LedgerSummaryResponse entries
         * @property {string|null} [totalDebit] LedgerSummaryResponse totalDebit
         * @property {string|null} [totalCredit] LedgerSummaryResponse totalCredit
         * @property {string|null} [netBalance] LedgerSummaryResponse netBalance
         */

        /**
         * Constructs a new LedgerSummaryResponse.
         * @memberof omnora
         * @classdesc Represents a LedgerSummaryResponse.
         * @implements ILedgerSummaryResponse
         * @constructor
         * @param {omnora.ILedgerSummaryResponse=} [properties] Properties to set
         */
        function LedgerSummaryResponse(properties) {
            this.entries = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LedgerSummaryResponse entries.
         * @member {Array.<omnora.ILedgerEntryItem>} entries
         * @memberof omnora.LedgerSummaryResponse
         * @instance
         */
        LedgerSummaryResponse.prototype.entries = $util.emptyArray;

        /**
         * LedgerSummaryResponse totalDebit.
         * @member {string} totalDebit
         * @memberof omnora.LedgerSummaryResponse
         * @instance
         */
        LedgerSummaryResponse.prototype.totalDebit = "";

        /**
         * LedgerSummaryResponse totalCredit.
         * @member {string} totalCredit
         * @memberof omnora.LedgerSummaryResponse
         * @instance
         */
        LedgerSummaryResponse.prototype.totalCredit = "";

        /**
         * LedgerSummaryResponse netBalance.
         * @member {string} netBalance
         * @memberof omnora.LedgerSummaryResponse
         * @instance
         */
        LedgerSummaryResponse.prototype.netBalance = "";

        /**
         * Creates a new LedgerSummaryResponse instance using the specified properties.
         * @function create
         * @memberof omnora.LedgerSummaryResponse
         * @static
         * @param {omnora.ILedgerSummaryResponse=} [properties] Properties to set
         * @returns {omnora.LedgerSummaryResponse} LedgerSummaryResponse instance
         */
        LedgerSummaryResponse.create = function create(properties) {
            return new LedgerSummaryResponse(properties);
        };

        /**
         * Encodes the specified LedgerSummaryResponse message. Does not implicitly {@link omnora.LedgerSummaryResponse.verify|verify} messages.
         * @function encode
         * @memberof omnora.LedgerSummaryResponse
         * @static
         * @param {omnora.ILedgerSummaryResponse} message LedgerSummaryResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LedgerSummaryResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.entries != null && message.entries.length)
                for (var i = 0; i < message.entries.length; ++i)
                    $root.omnora.LedgerEntryItem.encode(message.entries[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.totalDebit != null && Object.hasOwnProperty.call(message, "totalDebit"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.totalDebit);
            if (message.totalCredit != null && Object.hasOwnProperty.call(message, "totalCredit"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.totalCredit);
            if (message.netBalance != null && Object.hasOwnProperty.call(message, "netBalance"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.netBalance);
            return writer;
        };

        /**
         * Encodes the specified LedgerSummaryResponse message, length delimited. Does not implicitly {@link omnora.LedgerSummaryResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.LedgerSummaryResponse
         * @static
         * @param {omnora.ILedgerSummaryResponse} message LedgerSummaryResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LedgerSummaryResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LedgerSummaryResponse message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.LedgerSummaryResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.LedgerSummaryResponse} LedgerSummaryResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LedgerSummaryResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.LedgerSummaryResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.entries && message.entries.length))
                        message.entries = [];
                    message.entries.push($root.omnora.LedgerEntryItem.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.totalDebit = reader.string();
                    break;
                case 3:
                    message.totalCredit = reader.string();
                    break;
                case 4:
                    message.netBalance = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LedgerSummaryResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.LedgerSummaryResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.LedgerSummaryResponse} LedgerSummaryResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LedgerSummaryResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LedgerSummaryResponse message.
         * @function verify
         * @memberof omnora.LedgerSummaryResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LedgerSummaryResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.entries != null && message.hasOwnProperty("entries")) {
                if (!Array.isArray(message.entries))
                    return "entries: array expected";
                for (var i = 0; i < message.entries.length; ++i) {
                    var error = $root.omnora.LedgerEntryItem.verify(message.entries[i]);
                    if (error)
                        return "entries." + error;
                }
            }
            if (message.totalDebit != null && message.hasOwnProperty("totalDebit"))
                if (!$util.isString(message.totalDebit))
                    return "totalDebit: string expected";
            if (message.totalCredit != null && message.hasOwnProperty("totalCredit"))
                if (!$util.isString(message.totalCredit))
                    return "totalCredit: string expected";
            if (message.netBalance != null && message.hasOwnProperty("netBalance"))
                if (!$util.isString(message.netBalance))
                    return "netBalance: string expected";
            return null;
        };

        /**
         * Creates a LedgerSummaryResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.LedgerSummaryResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.LedgerSummaryResponse} LedgerSummaryResponse
         */
        LedgerSummaryResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.LedgerSummaryResponse)
                return object;
            var message = new $root.omnora.LedgerSummaryResponse();
            if (object.entries) {
                if (!Array.isArray(object.entries))
                    throw TypeError(".omnora.LedgerSummaryResponse.entries: array expected");
                message.entries = [];
                for (var i = 0; i < object.entries.length; ++i) {
                    if (typeof object.entries[i] !== "object")
                        throw TypeError(".omnora.LedgerSummaryResponse.entries: object expected");
                    message.entries[i] = $root.omnora.LedgerEntryItem.fromObject(object.entries[i]);
                }
            }
            if (object.totalDebit != null)
                message.totalDebit = String(object.totalDebit);
            if (object.totalCredit != null)
                message.totalCredit = String(object.totalCredit);
            if (object.netBalance != null)
                message.netBalance = String(object.netBalance);
            return message;
        };

        /**
         * Creates a plain object from a LedgerSummaryResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.LedgerSummaryResponse
         * @static
         * @param {omnora.LedgerSummaryResponse} message LedgerSummaryResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LedgerSummaryResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.entries = [];
            if (options.defaults) {
                object.totalDebit = "";
                object.totalCredit = "";
                object.netBalance = "";
            }
            if (message.entries && message.entries.length) {
                object.entries = [];
                for (var j = 0; j < message.entries.length; ++j)
                    object.entries[j] = $root.omnora.LedgerEntryItem.toObject(message.entries[j], options);
            }
            if (message.totalDebit != null && message.hasOwnProperty("totalDebit"))
                object.totalDebit = message.totalDebit;
            if (message.totalCredit != null && message.hasOwnProperty("totalCredit"))
                object.totalCredit = message.totalCredit;
            if (message.netBalance != null && message.hasOwnProperty("netBalance"))
                object.netBalance = message.netBalance;
            return object;
        };

        /**
         * Converts this LedgerSummaryResponse to JSON.
         * @function toJSON
         * @memberof omnora.LedgerSummaryResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LedgerSummaryResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return LedgerSummaryResponse;
    })();

    omnora.LedgerEntryItem = (function() {

        /**
         * Properties of a LedgerEntryItem.
         * @memberof omnora
         * @interface ILedgerEntryItem
         * @property {string|null} [entryId] LedgerEntryItem entryId
         * @property {string|null} [txRef] LedgerEntryItem txRef
         * @property {string|null} [accountName] LedgerEntryItem accountName
         * @property {string|null} [partyName] LedgerEntryItem partyName
         * @property {string|null} [entryType] LedgerEntryItem entryType
         * @property {string|null} [amount] LedgerEntryItem amount
         * @property {string|null} [description] LedgerEntryItem description
         * @property {number|Long|null} [postedAt] LedgerEntryItem postedAt
         */

        /**
         * Constructs a new LedgerEntryItem.
         * @memberof omnora
         * @classdesc Represents a LedgerEntryItem.
         * @implements ILedgerEntryItem
         * @constructor
         * @param {omnora.ILedgerEntryItem=} [properties] Properties to set
         */
        function LedgerEntryItem(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LedgerEntryItem entryId.
         * @member {string} entryId
         * @memberof omnora.LedgerEntryItem
         * @instance
         */
        LedgerEntryItem.prototype.entryId = "";

        /**
         * LedgerEntryItem txRef.
         * @member {string} txRef
         * @memberof omnora.LedgerEntryItem
         * @instance
         */
        LedgerEntryItem.prototype.txRef = "";

        /**
         * LedgerEntryItem accountName.
         * @member {string} accountName
         * @memberof omnora.LedgerEntryItem
         * @instance
         */
        LedgerEntryItem.prototype.accountName = "";

        /**
         * LedgerEntryItem partyName.
         * @member {string} partyName
         * @memberof omnora.LedgerEntryItem
         * @instance
         */
        LedgerEntryItem.prototype.partyName = "";

        /**
         * LedgerEntryItem entryType.
         * @member {string} entryType
         * @memberof omnora.LedgerEntryItem
         * @instance
         */
        LedgerEntryItem.prototype.entryType = "";

        /**
         * LedgerEntryItem amount.
         * @member {string} amount
         * @memberof omnora.LedgerEntryItem
         * @instance
         */
        LedgerEntryItem.prototype.amount = "";

        /**
         * LedgerEntryItem description.
         * @member {string} description
         * @memberof omnora.LedgerEntryItem
         * @instance
         */
        LedgerEntryItem.prototype.description = "";

        /**
         * LedgerEntryItem postedAt.
         * @member {number|Long} postedAt
         * @memberof omnora.LedgerEntryItem
         * @instance
         */
        LedgerEntryItem.prototype.postedAt = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new LedgerEntryItem instance using the specified properties.
         * @function create
         * @memberof omnora.LedgerEntryItem
         * @static
         * @param {omnora.ILedgerEntryItem=} [properties] Properties to set
         * @returns {omnora.LedgerEntryItem} LedgerEntryItem instance
         */
        LedgerEntryItem.create = function create(properties) {
            return new LedgerEntryItem(properties);
        };

        /**
         * Encodes the specified LedgerEntryItem message. Does not implicitly {@link omnora.LedgerEntryItem.verify|verify} messages.
         * @function encode
         * @memberof omnora.LedgerEntryItem
         * @static
         * @param {omnora.ILedgerEntryItem} message LedgerEntryItem message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LedgerEntryItem.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.entryId != null && Object.hasOwnProperty.call(message, "entryId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.entryId);
            if (message.txRef != null && Object.hasOwnProperty.call(message, "txRef"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.txRef);
            if (message.accountName != null && Object.hasOwnProperty.call(message, "accountName"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.accountName);
            if (message.partyName != null && Object.hasOwnProperty.call(message, "partyName"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.partyName);
            if (message.entryType != null && Object.hasOwnProperty.call(message, "entryType"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.entryType);
            if (message.amount != null && Object.hasOwnProperty.call(message, "amount"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.amount);
            if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.description);
            if (message.postedAt != null && Object.hasOwnProperty.call(message, "postedAt"))
                writer.uint32(/* id 8, wireType 0 =*/64).int64(message.postedAt);
            return writer;
        };

        /**
         * Encodes the specified LedgerEntryItem message, length delimited. Does not implicitly {@link omnora.LedgerEntryItem.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.LedgerEntryItem
         * @static
         * @param {omnora.ILedgerEntryItem} message LedgerEntryItem message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LedgerEntryItem.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LedgerEntryItem message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.LedgerEntryItem
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.LedgerEntryItem} LedgerEntryItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LedgerEntryItem.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.LedgerEntryItem();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.entryId = reader.string();
                    break;
                case 2:
                    message.txRef = reader.string();
                    break;
                case 3:
                    message.accountName = reader.string();
                    break;
                case 4:
                    message.partyName = reader.string();
                    break;
                case 5:
                    message.entryType = reader.string();
                    break;
                case 6:
                    message.amount = reader.string();
                    break;
                case 7:
                    message.description = reader.string();
                    break;
                case 8:
                    message.postedAt = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LedgerEntryItem message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.LedgerEntryItem
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.LedgerEntryItem} LedgerEntryItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LedgerEntryItem.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LedgerEntryItem message.
         * @function verify
         * @memberof omnora.LedgerEntryItem
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LedgerEntryItem.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.entryId != null && message.hasOwnProperty("entryId"))
                if (!$util.isString(message.entryId))
                    return "entryId: string expected";
            if (message.txRef != null && message.hasOwnProperty("txRef"))
                if (!$util.isString(message.txRef))
                    return "txRef: string expected";
            if (message.accountName != null && message.hasOwnProperty("accountName"))
                if (!$util.isString(message.accountName))
                    return "accountName: string expected";
            if (message.partyName != null && message.hasOwnProperty("partyName"))
                if (!$util.isString(message.partyName))
                    return "partyName: string expected";
            if (message.entryType != null && message.hasOwnProperty("entryType"))
                if (!$util.isString(message.entryType))
                    return "entryType: string expected";
            if (message.amount != null && message.hasOwnProperty("amount"))
                if (!$util.isString(message.amount))
                    return "amount: string expected";
            if (message.description != null && message.hasOwnProperty("description"))
                if (!$util.isString(message.description))
                    return "description: string expected";
            if (message.postedAt != null && message.hasOwnProperty("postedAt"))
                if (!$util.isInteger(message.postedAt) && !(message.postedAt && $util.isInteger(message.postedAt.low) && $util.isInteger(message.postedAt.high)))
                    return "postedAt: integer|Long expected";
            return null;
        };

        /**
         * Creates a LedgerEntryItem message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.LedgerEntryItem
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.LedgerEntryItem} LedgerEntryItem
         */
        LedgerEntryItem.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.LedgerEntryItem)
                return object;
            var message = new $root.omnora.LedgerEntryItem();
            if (object.entryId != null)
                message.entryId = String(object.entryId);
            if (object.txRef != null)
                message.txRef = String(object.txRef);
            if (object.accountName != null)
                message.accountName = String(object.accountName);
            if (object.partyName != null)
                message.partyName = String(object.partyName);
            if (object.entryType != null)
                message.entryType = String(object.entryType);
            if (object.amount != null)
                message.amount = String(object.amount);
            if (object.description != null)
                message.description = String(object.description);
            if (object.postedAt != null)
                if ($util.Long)
                    (message.postedAt = $util.Long.fromValue(object.postedAt)).unsigned = false;
                else if (typeof object.postedAt === "string")
                    message.postedAt = parseInt(object.postedAt, 10);
                else if (typeof object.postedAt === "number")
                    message.postedAt = object.postedAt;
                else if (typeof object.postedAt === "object")
                    message.postedAt = new $util.LongBits(object.postedAt.low >>> 0, object.postedAt.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a LedgerEntryItem message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.LedgerEntryItem
         * @static
         * @param {omnora.LedgerEntryItem} message LedgerEntryItem
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LedgerEntryItem.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.entryId = "";
                object.txRef = "";
                object.accountName = "";
                object.partyName = "";
                object.entryType = "";
                object.amount = "";
                object.description = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.postedAt = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.postedAt = options.longs === String ? "0" : 0;
            }
            if (message.entryId != null && message.hasOwnProperty("entryId"))
                object.entryId = message.entryId;
            if (message.txRef != null && message.hasOwnProperty("txRef"))
                object.txRef = message.txRef;
            if (message.accountName != null && message.hasOwnProperty("accountName"))
                object.accountName = message.accountName;
            if (message.partyName != null && message.hasOwnProperty("partyName"))
                object.partyName = message.partyName;
            if (message.entryType != null && message.hasOwnProperty("entryType"))
                object.entryType = message.entryType;
            if (message.amount != null && message.hasOwnProperty("amount"))
                object.amount = message.amount;
            if (message.description != null && message.hasOwnProperty("description"))
                object.description = message.description;
            if (message.postedAt != null && message.hasOwnProperty("postedAt"))
                if (typeof message.postedAt === "number")
                    object.postedAt = options.longs === String ? String(message.postedAt) : message.postedAt;
                else
                    object.postedAt = options.longs === String ? $util.Long.prototype.toString.call(message.postedAt) : options.longs === Number ? new $util.LongBits(message.postedAt.low >>> 0, message.postedAt.high >>> 0).toNumber() : message.postedAt;
            return object;
        };

        /**
         * Converts this LedgerEntryItem to JSON.
         * @function toJSON
         * @memberof omnora.LedgerEntryItem
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LedgerEntryItem.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return LedgerEntryItem;
    })();

    omnora.PartyBalanceRequest = (function() {

        /**
         * Properties of a PartyBalanceRequest.
         * @memberof omnora
         * @interface IPartyBalanceRequest
         * @property {string|null} [nodeId] PartyBalanceRequest nodeId
         * @property {string|null} [partyType] PartyBalanceRequest partyType
         * @property {number|null} [limit] PartyBalanceRequest limit
         */

        /**
         * Constructs a new PartyBalanceRequest.
         * @memberof omnora
         * @classdesc Represents a PartyBalanceRequest.
         * @implements IPartyBalanceRequest
         * @constructor
         * @param {omnora.IPartyBalanceRequest=} [properties] Properties to set
         */
        function PartyBalanceRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PartyBalanceRequest nodeId.
         * @member {string} nodeId
         * @memberof omnora.PartyBalanceRequest
         * @instance
         */
        PartyBalanceRequest.prototype.nodeId = "";

        /**
         * PartyBalanceRequest partyType.
         * @member {string} partyType
         * @memberof omnora.PartyBalanceRequest
         * @instance
         */
        PartyBalanceRequest.prototype.partyType = "";

        /**
         * PartyBalanceRequest limit.
         * @member {number} limit
         * @memberof omnora.PartyBalanceRequest
         * @instance
         */
        PartyBalanceRequest.prototype.limit = 0;

        /**
         * Creates a new PartyBalanceRequest instance using the specified properties.
         * @function create
         * @memberof omnora.PartyBalanceRequest
         * @static
         * @param {omnora.IPartyBalanceRequest=} [properties] Properties to set
         * @returns {omnora.PartyBalanceRequest} PartyBalanceRequest instance
         */
        PartyBalanceRequest.create = function create(properties) {
            return new PartyBalanceRequest(properties);
        };

        /**
         * Encodes the specified PartyBalanceRequest message. Does not implicitly {@link omnora.PartyBalanceRequest.verify|verify} messages.
         * @function encode
         * @memberof omnora.PartyBalanceRequest
         * @static
         * @param {omnora.IPartyBalanceRequest} message PartyBalanceRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PartyBalanceRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nodeId != null && Object.hasOwnProperty.call(message, "nodeId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.nodeId);
            if (message.partyType != null && Object.hasOwnProperty.call(message, "partyType"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.partyType);
            if (message.limit != null && Object.hasOwnProperty.call(message, "limit"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.limit);
            return writer;
        };

        /**
         * Encodes the specified PartyBalanceRequest message, length delimited. Does not implicitly {@link omnora.PartyBalanceRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.PartyBalanceRequest
         * @static
         * @param {omnora.IPartyBalanceRequest} message PartyBalanceRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PartyBalanceRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PartyBalanceRequest message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.PartyBalanceRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.PartyBalanceRequest} PartyBalanceRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PartyBalanceRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.PartyBalanceRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nodeId = reader.string();
                    break;
                case 2:
                    message.partyType = reader.string();
                    break;
                case 3:
                    message.limit = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PartyBalanceRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.PartyBalanceRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.PartyBalanceRequest} PartyBalanceRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PartyBalanceRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PartyBalanceRequest message.
         * @function verify
         * @memberof omnora.PartyBalanceRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PartyBalanceRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                if (!$util.isString(message.nodeId))
                    return "nodeId: string expected";
            if (message.partyType != null && message.hasOwnProperty("partyType"))
                if (!$util.isString(message.partyType))
                    return "partyType: string expected";
            if (message.limit != null && message.hasOwnProperty("limit"))
                if (!$util.isInteger(message.limit))
                    return "limit: integer expected";
            return null;
        };

        /**
         * Creates a PartyBalanceRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.PartyBalanceRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.PartyBalanceRequest} PartyBalanceRequest
         */
        PartyBalanceRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.PartyBalanceRequest)
                return object;
            var message = new $root.omnora.PartyBalanceRequest();
            if (object.nodeId != null)
                message.nodeId = String(object.nodeId);
            if (object.partyType != null)
                message.partyType = String(object.partyType);
            if (object.limit != null)
                message.limit = object.limit | 0;
            return message;
        };

        /**
         * Creates a plain object from a PartyBalanceRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.PartyBalanceRequest
         * @static
         * @param {omnora.PartyBalanceRequest} message PartyBalanceRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PartyBalanceRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.nodeId = "";
                object.partyType = "";
                object.limit = 0;
            }
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                object.nodeId = message.nodeId;
            if (message.partyType != null && message.hasOwnProperty("partyType"))
                object.partyType = message.partyType;
            if (message.limit != null && message.hasOwnProperty("limit"))
                object.limit = message.limit;
            return object;
        };

        /**
         * Converts this PartyBalanceRequest to JSON.
         * @function toJSON
         * @memberof omnora.PartyBalanceRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PartyBalanceRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PartyBalanceRequest;
    })();

    omnora.PartyBalanceResponse = (function() {

        /**
         * Properties of a PartyBalanceResponse.
         * @memberof omnora
         * @interface IPartyBalanceResponse
         * @property {Array.<omnora.IPartyBalanceItem>|null} [parties] PartyBalanceResponse parties
         */

        /**
         * Constructs a new PartyBalanceResponse.
         * @memberof omnora
         * @classdesc Represents a PartyBalanceResponse.
         * @implements IPartyBalanceResponse
         * @constructor
         * @param {omnora.IPartyBalanceResponse=} [properties] Properties to set
         */
        function PartyBalanceResponse(properties) {
            this.parties = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PartyBalanceResponse parties.
         * @member {Array.<omnora.IPartyBalanceItem>} parties
         * @memberof omnora.PartyBalanceResponse
         * @instance
         */
        PartyBalanceResponse.prototype.parties = $util.emptyArray;

        /**
         * Creates a new PartyBalanceResponse instance using the specified properties.
         * @function create
         * @memberof omnora.PartyBalanceResponse
         * @static
         * @param {omnora.IPartyBalanceResponse=} [properties] Properties to set
         * @returns {omnora.PartyBalanceResponse} PartyBalanceResponse instance
         */
        PartyBalanceResponse.create = function create(properties) {
            return new PartyBalanceResponse(properties);
        };

        /**
         * Encodes the specified PartyBalanceResponse message. Does not implicitly {@link omnora.PartyBalanceResponse.verify|verify} messages.
         * @function encode
         * @memberof omnora.PartyBalanceResponse
         * @static
         * @param {omnora.IPartyBalanceResponse} message PartyBalanceResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PartyBalanceResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.parties != null && message.parties.length)
                for (var i = 0; i < message.parties.length; ++i)
                    $root.omnora.PartyBalanceItem.encode(message.parties[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified PartyBalanceResponse message, length delimited. Does not implicitly {@link omnora.PartyBalanceResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.PartyBalanceResponse
         * @static
         * @param {omnora.IPartyBalanceResponse} message PartyBalanceResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PartyBalanceResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PartyBalanceResponse message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.PartyBalanceResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.PartyBalanceResponse} PartyBalanceResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PartyBalanceResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.PartyBalanceResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.parties && message.parties.length))
                        message.parties = [];
                    message.parties.push($root.omnora.PartyBalanceItem.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PartyBalanceResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.PartyBalanceResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.PartyBalanceResponse} PartyBalanceResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PartyBalanceResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PartyBalanceResponse message.
         * @function verify
         * @memberof omnora.PartyBalanceResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PartyBalanceResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.parties != null && message.hasOwnProperty("parties")) {
                if (!Array.isArray(message.parties))
                    return "parties: array expected";
                for (var i = 0; i < message.parties.length; ++i) {
                    var error = $root.omnora.PartyBalanceItem.verify(message.parties[i]);
                    if (error)
                        return "parties." + error;
                }
            }
            return null;
        };

        /**
         * Creates a PartyBalanceResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.PartyBalanceResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.PartyBalanceResponse} PartyBalanceResponse
         */
        PartyBalanceResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.PartyBalanceResponse)
                return object;
            var message = new $root.omnora.PartyBalanceResponse();
            if (object.parties) {
                if (!Array.isArray(object.parties))
                    throw TypeError(".omnora.PartyBalanceResponse.parties: array expected");
                message.parties = [];
                for (var i = 0; i < object.parties.length; ++i) {
                    if (typeof object.parties[i] !== "object")
                        throw TypeError(".omnora.PartyBalanceResponse.parties: object expected");
                    message.parties[i] = $root.omnora.PartyBalanceItem.fromObject(object.parties[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a PartyBalanceResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.PartyBalanceResponse
         * @static
         * @param {omnora.PartyBalanceResponse} message PartyBalanceResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PartyBalanceResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.parties = [];
            if (message.parties && message.parties.length) {
                object.parties = [];
                for (var j = 0; j < message.parties.length; ++j)
                    object.parties[j] = $root.omnora.PartyBalanceItem.toObject(message.parties[j], options);
            }
            return object;
        };

        /**
         * Converts this PartyBalanceResponse to JSON.
         * @function toJSON
         * @memberof omnora.PartyBalanceResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PartyBalanceResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PartyBalanceResponse;
    })();

    omnora.PartyBalanceItem = (function() {

        /**
         * Properties of a PartyBalanceItem.
         * @memberof omnora
         * @interface IPartyBalanceItem
         * @property {string|null} [partyId] PartyBalanceItem partyId
         * @property {string|null} [name] PartyBalanceItem name
         * @property {string|null} [currentBalance] PartyBalanceItem currentBalance
         * @property {boolean|null} [isBlocked] PartyBalanceItem isBlocked
         * @property {string|null} [partyType] PartyBalanceItem partyType
         * @property {number|null} [overdueDays] PartyBalanceItem overdueDays
         */

        /**
         * Constructs a new PartyBalanceItem.
         * @memberof omnora
         * @classdesc Represents a PartyBalanceItem.
         * @implements IPartyBalanceItem
         * @constructor
         * @param {omnora.IPartyBalanceItem=} [properties] Properties to set
         */
        function PartyBalanceItem(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PartyBalanceItem partyId.
         * @member {string} partyId
         * @memberof omnora.PartyBalanceItem
         * @instance
         */
        PartyBalanceItem.prototype.partyId = "";

        /**
         * PartyBalanceItem name.
         * @member {string} name
         * @memberof omnora.PartyBalanceItem
         * @instance
         */
        PartyBalanceItem.prototype.name = "";

        /**
         * PartyBalanceItem currentBalance.
         * @member {string} currentBalance
         * @memberof omnora.PartyBalanceItem
         * @instance
         */
        PartyBalanceItem.prototype.currentBalance = "";

        /**
         * PartyBalanceItem isBlocked.
         * @member {boolean} isBlocked
         * @memberof omnora.PartyBalanceItem
         * @instance
         */
        PartyBalanceItem.prototype.isBlocked = false;

        /**
         * PartyBalanceItem partyType.
         * @member {string} partyType
         * @memberof omnora.PartyBalanceItem
         * @instance
         */
        PartyBalanceItem.prototype.partyType = "";

        /**
         * PartyBalanceItem overdueDays.
         * @member {number} overdueDays
         * @memberof omnora.PartyBalanceItem
         * @instance
         */
        PartyBalanceItem.prototype.overdueDays = 0;

        /**
         * Creates a new PartyBalanceItem instance using the specified properties.
         * @function create
         * @memberof omnora.PartyBalanceItem
         * @static
         * @param {omnora.IPartyBalanceItem=} [properties] Properties to set
         * @returns {omnora.PartyBalanceItem} PartyBalanceItem instance
         */
        PartyBalanceItem.create = function create(properties) {
            return new PartyBalanceItem(properties);
        };

        /**
         * Encodes the specified PartyBalanceItem message. Does not implicitly {@link omnora.PartyBalanceItem.verify|verify} messages.
         * @function encode
         * @memberof omnora.PartyBalanceItem
         * @static
         * @param {omnora.IPartyBalanceItem} message PartyBalanceItem message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PartyBalanceItem.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.partyId != null && Object.hasOwnProperty.call(message, "partyId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.partyId);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.currentBalance != null && Object.hasOwnProperty.call(message, "currentBalance"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.currentBalance);
            if (message.isBlocked != null && Object.hasOwnProperty.call(message, "isBlocked"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.isBlocked);
            if (message.partyType != null && Object.hasOwnProperty.call(message, "partyType"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.partyType);
            if (message.overdueDays != null && Object.hasOwnProperty.call(message, "overdueDays"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.overdueDays);
            return writer;
        };

        /**
         * Encodes the specified PartyBalanceItem message, length delimited. Does not implicitly {@link omnora.PartyBalanceItem.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.PartyBalanceItem
         * @static
         * @param {omnora.IPartyBalanceItem} message PartyBalanceItem message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PartyBalanceItem.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PartyBalanceItem message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.PartyBalanceItem
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.PartyBalanceItem} PartyBalanceItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PartyBalanceItem.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.PartyBalanceItem();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.partyId = reader.string();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                case 3:
                    message.currentBalance = reader.string();
                    break;
                case 4:
                    message.isBlocked = reader.bool();
                    break;
                case 5:
                    message.partyType = reader.string();
                    break;
                case 6:
                    message.overdueDays = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PartyBalanceItem message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.PartyBalanceItem
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.PartyBalanceItem} PartyBalanceItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PartyBalanceItem.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PartyBalanceItem message.
         * @function verify
         * @memberof omnora.PartyBalanceItem
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PartyBalanceItem.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.partyId != null && message.hasOwnProperty("partyId"))
                if (!$util.isString(message.partyId))
                    return "partyId: string expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.currentBalance != null && message.hasOwnProperty("currentBalance"))
                if (!$util.isString(message.currentBalance))
                    return "currentBalance: string expected";
            if (message.isBlocked != null && message.hasOwnProperty("isBlocked"))
                if (typeof message.isBlocked !== "boolean")
                    return "isBlocked: boolean expected";
            if (message.partyType != null && message.hasOwnProperty("partyType"))
                if (!$util.isString(message.partyType))
                    return "partyType: string expected";
            if (message.overdueDays != null && message.hasOwnProperty("overdueDays"))
                if (!$util.isInteger(message.overdueDays))
                    return "overdueDays: integer expected";
            return null;
        };

        /**
         * Creates a PartyBalanceItem message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.PartyBalanceItem
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.PartyBalanceItem} PartyBalanceItem
         */
        PartyBalanceItem.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.PartyBalanceItem)
                return object;
            var message = new $root.omnora.PartyBalanceItem();
            if (object.partyId != null)
                message.partyId = String(object.partyId);
            if (object.name != null)
                message.name = String(object.name);
            if (object.currentBalance != null)
                message.currentBalance = String(object.currentBalance);
            if (object.isBlocked != null)
                message.isBlocked = Boolean(object.isBlocked);
            if (object.partyType != null)
                message.partyType = String(object.partyType);
            if (object.overdueDays != null)
                message.overdueDays = object.overdueDays | 0;
            return message;
        };

        /**
         * Creates a plain object from a PartyBalanceItem message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.PartyBalanceItem
         * @static
         * @param {omnora.PartyBalanceItem} message PartyBalanceItem
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PartyBalanceItem.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.partyId = "";
                object.name = "";
                object.currentBalance = "";
                object.isBlocked = false;
                object.partyType = "";
                object.overdueDays = 0;
            }
            if (message.partyId != null && message.hasOwnProperty("partyId"))
                object.partyId = message.partyId;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.currentBalance != null && message.hasOwnProperty("currentBalance"))
                object.currentBalance = message.currentBalance;
            if (message.isBlocked != null && message.hasOwnProperty("isBlocked"))
                object.isBlocked = message.isBlocked;
            if (message.partyType != null && message.hasOwnProperty("partyType"))
                object.partyType = message.partyType;
            if (message.overdueDays != null && message.hasOwnProperty("overdueDays"))
                object.overdueDays = message.overdueDays;
            return object;
        };

        /**
         * Converts this PartyBalanceItem to JSON.
         * @function toJSON
         * @memberof omnora.PartyBalanceItem
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PartyBalanceItem.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PartyBalanceItem;
    })();

    omnora.InvoiceSummaryRequest = (function() {

        /**
         * Properties of an InvoiceSummaryRequest.
         * @memberof omnora
         * @interface IInvoiceSummaryRequest
         * @property {string|null} [nodeId] InvoiceSummaryRequest nodeId
         * @property {string|null} [dateFrom] InvoiceSummaryRequest dateFrom
         * @property {string|null} [dateTo] InvoiceSummaryRequest dateTo
         */

        /**
         * Constructs a new InvoiceSummaryRequest.
         * @memberof omnora
         * @classdesc Represents an InvoiceSummaryRequest.
         * @implements IInvoiceSummaryRequest
         * @constructor
         * @param {omnora.IInvoiceSummaryRequest=} [properties] Properties to set
         */
        function InvoiceSummaryRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * InvoiceSummaryRequest nodeId.
         * @member {string} nodeId
         * @memberof omnora.InvoiceSummaryRequest
         * @instance
         */
        InvoiceSummaryRequest.prototype.nodeId = "";

        /**
         * InvoiceSummaryRequest dateFrom.
         * @member {string} dateFrom
         * @memberof omnora.InvoiceSummaryRequest
         * @instance
         */
        InvoiceSummaryRequest.prototype.dateFrom = "";

        /**
         * InvoiceSummaryRequest dateTo.
         * @member {string} dateTo
         * @memberof omnora.InvoiceSummaryRequest
         * @instance
         */
        InvoiceSummaryRequest.prototype.dateTo = "";

        /**
         * Creates a new InvoiceSummaryRequest instance using the specified properties.
         * @function create
         * @memberof omnora.InvoiceSummaryRequest
         * @static
         * @param {omnora.IInvoiceSummaryRequest=} [properties] Properties to set
         * @returns {omnora.InvoiceSummaryRequest} InvoiceSummaryRequest instance
         */
        InvoiceSummaryRequest.create = function create(properties) {
            return new InvoiceSummaryRequest(properties);
        };

        /**
         * Encodes the specified InvoiceSummaryRequest message. Does not implicitly {@link omnora.InvoiceSummaryRequest.verify|verify} messages.
         * @function encode
         * @memberof omnora.InvoiceSummaryRequest
         * @static
         * @param {omnora.IInvoiceSummaryRequest} message InvoiceSummaryRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InvoiceSummaryRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nodeId != null && Object.hasOwnProperty.call(message, "nodeId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.nodeId);
            if (message.dateFrom != null && Object.hasOwnProperty.call(message, "dateFrom"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.dateFrom);
            if (message.dateTo != null && Object.hasOwnProperty.call(message, "dateTo"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.dateTo);
            return writer;
        };

        /**
         * Encodes the specified InvoiceSummaryRequest message, length delimited. Does not implicitly {@link omnora.InvoiceSummaryRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.InvoiceSummaryRequest
         * @static
         * @param {omnora.IInvoiceSummaryRequest} message InvoiceSummaryRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InvoiceSummaryRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an InvoiceSummaryRequest message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.InvoiceSummaryRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.InvoiceSummaryRequest} InvoiceSummaryRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InvoiceSummaryRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.InvoiceSummaryRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nodeId = reader.string();
                    break;
                case 2:
                    message.dateFrom = reader.string();
                    break;
                case 3:
                    message.dateTo = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an InvoiceSummaryRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.InvoiceSummaryRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.InvoiceSummaryRequest} InvoiceSummaryRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InvoiceSummaryRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an InvoiceSummaryRequest message.
         * @function verify
         * @memberof omnora.InvoiceSummaryRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        InvoiceSummaryRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                if (!$util.isString(message.nodeId))
                    return "nodeId: string expected";
            if (message.dateFrom != null && message.hasOwnProperty("dateFrom"))
                if (!$util.isString(message.dateFrom))
                    return "dateFrom: string expected";
            if (message.dateTo != null && message.hasOwnProperty("dateTo"))
                if (!$util.isString(message.dateTo))
                    return "dateTo: string expected";
            return null;
        };

        /**
         * Creates an InvoiceSummaryRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.InvoiceSummaryRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.InvoiceSummaryRequest} InvoiceSummaryRequest
         */
        InvoiceSummaryRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.InvoiceSummaryRequest)
                return object;
            var message = new $root.omnora.InvoiceSummaryRequest();
            if (object.nodeId != null)
                message.nodeId = String(object.nodeId);
            if (object.dateFrom != null)
                message.dateFrom = String(object.dateFrom);
            if (object.dateTo != null)
                message.dateTo = String(object.dateTo);
            return message;
        };

        /**
         * Creates a plain object from an InvoiceSummaryRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.InvoiceSummaryRequest
         * @static
         * @param {omnora.InvoiceSummaryRequest} message InvoiceSummaryRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        InvoiceSummaryRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.nodeId = "";
                object.dateFrom = "";
                object.dateTo = "";
            }
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                object.nodeId = message.nodeId;
            if (message.dateFrom != null && message.hasOwnProperty("dateFrom"))
                object.dateFrom = message.dateFrom;
            if (message.dateTo != null && message.hasOwnProperty("dateTo"))
                object.dateTo = message.dateTo;
            return object;
        };

        /**
         * Converts this InvoiceSummaryRequest to JSON.
         * @function toJSON
         * @memberof omnora.InvoiceSummaryRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        InvoiceSummaryRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return InvoiceSummaryRequest;
    })();

    omnora.InvoiceSummaryResponse = (function() {

        /**
         * Properties of an InvoiceSummaryResponse.
         * @memberof omnora
         * @interface IInvoiceSummaryResponse
         * @property {Array.<omnora.IInvoiceSummaryItem>|null} [invoices] InvoiceSummaryResponse invoices
         * @property {string|null} [totalValue] InvoiceSummaryResponse totalValue
         * @property {number|null} [count] InvoiceSummaryResponse count
         */

        /**
         * Constructs a new InvoiceSummaryResponse.
         * @memberof omnora
         * @classdesc Represents an InvoiceSummaryResponse.
         * @implements IInvoiceSummaryResponse
         * @constructor
         * @param {omnora.IInvoiceSummaryResponse=} [properties] Properties to set
         */
        function InvoiceSummaryResponse(properties) {
            this.invoices = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * InvoiceSummaryResponse invoices.
         * @member {Array.<omnora.IInvoiceSummaryItem>} invoices
         * @memberof omnora.InvoiceSummaryResponse
         * @instance
         */
        InvoiceSummaryResponse.prototype.invoices = $util.emptyArray;

        /**
         * InvoiceSummaryResponse totalValue.
         * @member {string} totalValue
         * @memberof omnora.InvoiceSummaryResponse
         * @instance
         */
        InvoiceSummaryResponse.prototype.totalValue = "";

        /**
         * InvoiceSummaryResponse count.
         * @member {number} count
         * @memberof omnora.InvoiceSummaryResponse
         * @instance
         */
        InvoiceSummaryResponse.prototype.count = 0;

        /**
         * Creates a new InvoiceSummaryResponse instance using the specified properties.
         * @function create
         * @memberof omnora.InvoiceSummaryResponse
         * @static
         * @param {omnora.IInvoiceSummaryResponse=} [properties] Properties to set
         * @returns {omnora.InvoiceSummaryResponse} InvoiceSummaryResponse instance
         */
        InvoiceSummaryResponse.create = function create(properties) {
            return new InvoiceSummaryResponse(properties);
        };

        /**
         * Encodes the specified InvoiceSummaryResponse message. Does not implicitly {@link omnora.InvoiceSummaryResponse.verify|verify} messages.
         * @function encode
         * @memberof omnora.InvoiceSummaryResponse
         * @static
         * @param {omnora.IInvoiceSummaryResponse} message InvoiceSummaryResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InvoiceSummaryResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.invoices != null && message.invoices.length)
                for (var i = 0; i < message.invoices.length; ++i)
                    $root.omnora.InvoiceSummaryItem.encode(message.invoices[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.totalValue != null && Object.hasOwnProperty.call(message, "totalValue"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.totalValue);
            if (message.count != null && Object.hasOwnProperty.call(message, "count"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.count);
            return writer;
        };

        /**
         * Encodes the specified InvoiceSummaryResponse message, length delimited. Does not implicitly {@link omnora.InvoiceSummaryResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.InvoiceSummaryResponse
         * @static
         * @param {omnora.IInvoiceSummaryResponse} message InvoiceSummaryResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InvoiceSummaryResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an InvoiceSummaryResponse message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.InvoiceSummaryResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.InvoiceSummaryResponse} InvoiceSummaryResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InvoiceSummaryResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.InvoiceSummaryResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.invoices && message.invoices.length))
                        message.invoices = [];
                    message.invoices.push($root.omnora.InvoiceSummaryItem.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.totalValue = reader.string();
                    break;
                case 3:
                    message.count = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an InvoiceSummaryResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.InvoiceSummaryResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.InvoiceSummaryResponse} InvoiceSummaryResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InvoiceSummaryResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an InvoiceSummaryResponse message.
         * @function verify
         * @memberof omnora.InvoiceSummaryResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        InvoiceSummaryResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.invoices != null && message.hasOwnProperty("invoices")) {
                if (!Array.isArray(message.invoices))
                    return "invoices: array expected";
                for (var i = 0; i < message.invoices.length; ++i) {
                    var error = $root.omnora.InvoiceSummaryItem.verify(message.invoices[i]);
                    if (error)
                        return "invoices." + error;
                }
            }
            if (message.totalValue != null && message.hasOwnProperty("totalValue"))
                if (!$util.isString(message.totalValue))
                    return "totalValue: string expected";
            if (message.count != null && message.hasOwnProperty("count"))
                if (!$util.isInteger(message.count))
                    return "count: integer expected";
            return null;
        };

        /**
         * Creates an InvoiceSummaryResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.InvoiceSummaryResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.InvoiceSummaryResponse} InvoiceSummaryResponse
         */
        InvoiceSummaryResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.InvoiceSummaryResponse)
                return object;
            var message = new $root.omnora.InvoiceSummaryResponse();
            if (object.invoices) {
                if (!Array.isArray(object.invoices))
                    throw TypeError(".omnora.InvoiceSummaryResponse.invoices: array expected");
                message.invoices = [];
                for (var i = 0; i < object.invoices.length; ++i) {
                    if (typeof object.invoices[i] !== "object")
                        throw TypeError(".omnora.InvoiceSummaryResponse.invoices: object expected");
                    message.invoices[i] = $root.omnora.InvoiceSummaryItem.fromObject(object.invoices[i]);
                }
            }
            if (object.totalValue != null)
                message.totalValue = String(object.totalValue);
            if (object.count != null)
                message.count = object.count | 0;
            return message;
        };

        /**
         * Creates a plain object from an InvoiceSummaryResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.InvoiceSummaryResponse
         * @static
         * @param {omnora.InvoiceSummaryResponse} message InvoiceSummaryResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        InvoiceSummaryResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.invoices = [];
            if (options.defaults) {
                object.totalValue = "";
                object.count = 0;
            }
            if (message.invoices && message.invoices.length) {
                object.invoices = [];
                for (var j = 0; j < message.invoices.length; ++j)
                    object.invoices[j] = $root.omnora.InvoiceSummaryItem.toObject(message.invoices[j], options);
            }
            if (message.totalValue != null && message.hasOwnProperty("totalValue"))
                object.totalValue = message.totalValue;
            if (message.count != null && message.hasOwnProperty("count"))
                object.count = message.count;
            return object;
        };

        /**
         * Converts this InvoiceSummaryResponse to JSON.
         * @function toJSON
         * @memberof omnora.InvoiceSummaryResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        InvoiceSummaryResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return InvoiceSummaryResponse;
    })();

    omnora.InvoiceSummaryItem = (function() {

        /**
         * Properties of an InvoiceSummaryItem.
         * @memberof omnora
         * @interface IInvoiceSummaryItem
         * @property {string|null} [invoiceId] InvoiceSummaryItem invoiceId
         * @property {string|null} [invoiceNo] InvoiceSummaryItem invoiceNo
         * @property {string|null} [partyName] InvoiceSummaryItem partyName
         * @property {string|null} [total] InvoiceSummaryItem total
         * @property {string|null} [balanceDue] InvoiceSummaryItem balanceDue
         * @property {string|null} [status] InvoiceSummaryItem status
         * @property {number|Long|null} [issueDate] InvoiceSummaryItem issueDate
         * @property {number|Long|null} [dueDate] InvoiceSummaryItem dueDate
         */

        /**
         * Constructs a new InvoiceSummaryItem.
         * @memberof omnora
         * @classdesc Represents an InvoiceSummaryItem.
         * @implements IInvoiceSummaryItem
         * @constructor
         * @param {omnora.IInvoiceSummaryItem=} [properties] Properties to set
         */
        function InvoiceSummaryItem(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * InvoiceSummaryItem invoiceId.
         * @member {string} invoiceId
         * @memberof omnora.InvoiceSummaryItem
         * @instance
         */
        InvoiceSummaryItem.prototype.invoiceId = "";

        /**
         * InvoiceSummaryItem invoiceNo.
         * @member {string} invoiceNo
         * @memberof omnora.InvoiceSummaryItem
         * @instance
         */
        InvoiceSummaryItem.prototype.invoiceNo = "";

        /**
         * InvoiceSummaryItem partyName.
         * @member {string} partyName
         * @memberof omnora.InvoiceSummaryItem
         * @instance
         */
        InvoiceSummaryItem.prototype.partyName = "";

        /**
         * InvoiceSummaryItem total.
         * @member {string} total
         * @memberof omnora.InvoiceSummaryItem
         * @instance
         */
        InvoiceSummaryItem.prototype.total = "";

        /**
         * InvoiceSummaryItem balanceDue.
         * @member {string} balanceDue
         * @memberof omnora.InvoiceSummaryItem
         * @instance
         */
        InvoiceSummaryItem.prototype.balanceDue = "";

        /**
         * InvoiceSummaryItem status.
         * @member {string} status
         * @memberof omnora.InvoiceSummaryItem
         * @instance
         */
        InvoiceSummaryItem.prototype.status = "";

        /**
         * InvoiceSummaryItem issueDate.
         * @member {number|Long} issueDate
         * @memberof omnora.InvoiceSummaryItem
         * @instance
         */
        InvoiceSummaryItem.prototype.issueDate = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * InvoiceSummaryItem dueDate.
         * @member {number|Long} dueDate
         * @memberof omnora.InvoiceSummaryItem
         * @instance
         */
        InvoiceSummaryItem.prototype.dueDate = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new InvoiceSummaryItem instance using the specified properties.
         * @function create
         * @memberof omnora.InvoiceSummaryItem
         * @static
         * @param {omnora.IInvoiceSummaryItem=} [properties] Properties to set
         * @returns {omnora.InvoiceSummaryItem} InvoiceSummaryItem instance
         */
        InvoiceSummaryItem.create = function create(properties) {
            return new InvoiceSummaryItem(properties);
        };

        /**
         * Encodes the specified InvoiceSummaryItem message. Does not implicitly {@link omnora.InvoiceSummaryItem.verify|verify} messages.
         * @function encode
         * @memberof omnora.InvoiceSummaryItem
         * @static
         * @param {omnora.IInvoiceSummaryItem} message InvoiceSummaryItem message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InvoiceSummaryItem.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.invoiceId != null && Object.hasOwnProperty.call(message, "invoiceId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.invoiceId);
            if (message.invoiceNo != null && Object.hasOwnProperty.call(message, "invoiceNo"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.invoiceNo);
            if (message.partyName != null && Object.hasOwnProperty.call(message, "partyName"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.partyName);
            if (message.total != null && Object.hasOwnProperty.call(message, "total"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.total);
            if (message.balanceDue != null && Object.hasOwnProperty.call(message, "balanceDue"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.balanceDue);
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.status);
            if (message.issueDate != null && Object.hasOwnProperty.call(message, "issueDate"))
                writer.uint32(/* id 7, wireType 0 =*/56).int64(message.issueDate);
            if (message.dueDate != null && Object.hasOwnProperty.call(message, "dueDate"))
                writer.uint32(/* id 8, wireType 0 =*/64).int64(message.dueDate);
            return writer;
        };

        /**
         * Encodes the specified InvoiceSummaryItem message, length delimited. Does not implicitly {@link omnora.InvoiceSummaryItem.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.InvoiceSummaryItem
         * @static
         * @param {omnora.IInvoiceSummaryItem} message InvoiceSummaryItem message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InvoiceSummaryItem.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an InvoiceSummaryItem message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.InvoiceSummaryItem
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.InvoiceSummaryItem} InvoiceSummaryItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InvoiceSummaryItem.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.InvoiceSummaryItem();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.invoiceId = reader.string();
                    break;
                case 2:
                    message.invoiceNo = reader.string();
                    break;
                case 3:
                    message.partyName = reader.string();
                    break;
                case 4:
                    message.total = reader.string();
                    break;
                case 5:
                    message.balanceDue = reader.string();
                    break;
                case 6:
                    message.status = reader.string();
                    break;
                case 7:
                    message.issueDate = reader.int64();
                    break;
                case 8:
                    message.dueDate = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an InvoiceSummaryItem message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.InvoiceSummaryItem
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.InvoiceSummaryItem} InvoiceSummaryItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InvoiceSummaryItem.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an InvoiceSummaryItem message.
         * @function verify
         * @memberof omnora.InvoiceSummaryItem
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        InvoiceSummaryItem.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.invoiceId != null && message.hasOwnProperty("invoiceId"))
                if (!$util.isString(message.invoiceId))
                    return "invoiceId: string expected";
            if (message.invoiceNo != null && message.hasOwnProperty("invoiceNo"))
                if (!$util.isString(message.invoiceNo))
                    return "invoiceNo: string expected";
            if (message.partyName != null && message.hasOwnProperty("partyName"))
                if (!$util.isString(message.partyName))
                    return "partyName: string expected";
            if (message.total != null && message.hasOwnProperty("total"))
                if (!$util.isString(message.total))
                    return "total: string expected";
            if (message.balanceDue != null && message.hasOwnProperty("balanceDue"))
                if (!$util.isString(message.balanceDue))
                    return "balanceDue: string expected";
            if (message.status != null && message.hasOwnProperty("status"))
                if (!$util.isString(message.status))
                    return "status: string expected";
            if (message.issueDate != null && message.hasOwnProperty("issueDate"))
                if (!$util.isInteger(message.issueDate) && !(message.issueDate && $util.isInteger(message.issueDate.low) && $util.isInteger(message.issueDate.high)))
                    return "issueDate: integer|Long expected";
            if (message.dueDate != null && message.hasOwnProperty("dueDate"))
                if (!$util.isInteger(message.dueDate) && !(message.dueDate && $util.isInteger(message.dueDate.low) && $util.isInteger(message.dueDate.high)))
                    return "dueDate: integer|Long expected";
            return null;
        };

        /**
         * Creates an InvoiceSummaryItem message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.InvoiceSummaryItem
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.InvoiceSummaryItem} InvoiceSummaryItem
         */
        InvoiceSummaryItem.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.InvoiceSummaryItem)
                return object;
            var message = new $root.omnora.InvoiceSummaryItem();
            if (object.invoiceId != null)
                message.invoiceId = String(object.invoiceId);
            if (object.invoiceNo != null)
                message.invoiceNo = String(object.invoiceNo);
            if (object.partyName != null)
                message.partyName = String(object.partyName);
            if (object.total != null)
                message.total = String(object.total);
            if (object.balanceDue != null)
                message.balanceDue = String(object.balanceDue);
            if (object.status != null)
                message.status = String(object.status);
            if (object.issueDate != null)
                if ($util.Long)
                    (message.issueDate = $util.Long.fromValue(object.issueDate)).unsigned = false;
                else if (typeof object.issueDate === "string")
                    message.issueDate = parseInt(object.issueDate, 10);
                else if (typeof object.issueDate === "number")
                    message.issueDate = object.issueDate;
                else if (typeof object.issueDate === "object")
                    message.issueDate = new $util.LongBits(object.issueDate.low >>> 0, object.issueDate.high >>> 0).toNumber();
            if (object.dueDate != null)
                if ($util.Long)
                    (message.dueDate = $util.Long.fromValue(object.dueDate)).unsigned = false;
                else if (typeof object.dueDate === "string")
                    message.dueDate = parseInt(object.dueDate, 10);
                else if (typeof object.dueDate === "number")
                    message.dueDate = object.dueDate;
                else if (typeof object.dueDate === "object")
                    message.dueDate = new $util.LongBits(object.dueDate.low >>> 0, object.dueDate.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from an InvoiceSummaryItem message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.InvoiceSummaryItem
         * @static
         * @param {omnora.InvoiceSummaryItem} message InvoiceSummaryItem
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        InvoiceSummaryItem.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.invoiceId = "";
                object.invoiceNo = "";
                object.partyName = "";
                object.total = "";
                object.balanceDue = "";
                object.status = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.issueDate = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.issueDate = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.dueDate = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.dueDate = options.longs === String ? "0" : 0;
            }
            if (message.invoiceId != null && message.hasOwnProperty("invoiceId"))
                object.invoiceId = message.invoiceId;
            if (message.invoiceNo != null && message.hasOwnProperty("invoiceNo"))
                object.invoiceNo = message.invoiceNo;
            if (message.partyName != null && message.hasOwnProperty("partyName"))
                object.partyName = message.partyName;
            if (message.total != null && message.hasOwnProperty("total"))
                object.total = message.total;
            if (message.balanceDue != null && message.hasOwnProperty("balanceDue"))
                object.balanceDue = message.balanceDue;
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = message.status;
            if (message.issueDate != null && message.hasOwnProperty("issueDate"))
                if (typeof message.issueDate === "number")
                    object.issueDate = options.longs === String ? String(message.issueDate) : message.issueDate;
                else
                    object.issueDate = options.longs === String ? $util.Long.prototype.toString.call(message.issueDate) : options.longs === Number ? new $util.LongBits(message.issueDate.low >>> 0, message.issueDate.high >>> 0).toNumber() : message.issueDate;
            if (message.dueDate != null && message.hasOwnProperty("dueDate"))
                if (typeof message.dueDate === "number")
                    object.dueDate = options.longs === String ? String(message.dueDate) : message.dueDate;
                else
                    object.dueDate = options.longs === String ? $util.Long.prototype.toString.call(message.dueDate) : options.longs === Number ? new $util.LongBits(message.dueDate.low >>> 0, message.dueDate.high >>> 0).toNumber() : message.dueDate;
            return object;
        };

        /**
         * Converts this InvoiceSummaryItem to JSON.
         * @function toJSON
         * @memberof omnora.InvoiceSummaryItem
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        InvoiceSummaryItem.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return InvoiceSummaryItem;
    })();

    omnora.PaySlipRequest = (function() {

        /**
         * Properties of a PaySlipRequest.
         * @memberof omnora
         * @interface IPaySlipRequest
         * @property {string|null} [nodeId] PaySlipRequest nodeId
         * @property {string|null} [karigarId] PaySlipRequest karigarId
         * @property {string|null} [periodId] PaySlipRequest periodId
         */

        /**
         * Constructs a new PaySlipRequest.
         * @memberof omnora
         * @classdesc Represents a PaySlipRequest.
         * @implements IPaySlipRequest
         * @constructor
         * @param {omnora.IPaySlipRequest=} [properties] Properties to set
         */
        function PaySlipRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PaySlipRequest nodeId.
         * @member {string} nodeId
         * @memberof omnora.PaySlipRequest
         * @instance
         */
        PaySlipRequest.prototype.nodeId = "";

        /**
         * PaySlipRequest karigarId.
         * @member {string} karigarId
         * @memberof omnora.PaySlipRequest
         * @instance
         */
        PaySlipRequest.prototype.karigarId = "";

        /**
         * PaySlipRequest periodId.
         * @member {string} periodId
         * @memberof omnora.PaySlipRequest
         * @instance
         */
        PaySlipRequest.prototype.periodId = "";

        /**
         * Creates a new PaySlipRequest instance using the specified properties.
         * @function create
         * @memberof omnora.PaySlipRequest
         * @static
         * @param {omnora.IPaySlipRequest=} [properties] Properties to set
         * @returns {omnora.PaySlipRequest} PaySlipRequest instance
         */
        PaySlipRequest.create = function create(properties) {
            return new PaySlipRequest(properties);
        };

        /**
         * Encodes the specified PaySlipRequest message. Does not implicitly {@link omnora.PaySlipRequest.verify|verify} messages.
         * @function encode
         * @memberof omnora.PaySlipRequest
         * @static
         * @param {omnora.IPaySlipRequest} message PaySlipRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PaySlipRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nodeId != null && Object.hasOwnProperty.call(message, "nodeId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.nodeId);
            if (message.karigarId != null && Object.hasOwnProperty.call(message, "karigarId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.karigarId);
            if (message.periodId != null && Object.hasOwnProperty.call(message, "periodId"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.periodId);
            return writer;
        };

        /**
         * Encodes the specified PaySlipRequest message, length delimited. Does not implicitly {@link omnora.PaySlipRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.PaySlipRequest
         * @static
         * @param {omnora.IPaySlipRequest} message PaySlipRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PaySlipRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PaySlipRequest message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.PaySlipRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.PaySlipRequest} PaySlipRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PaySlipRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.PaySlipRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nodeId = reader.string();
                    break;
                case 2:
                    message.karigarId = reader.string();
                    break;
                case 3:
                    message.periodId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PaySlipRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.PaySlipRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.PaySlipRequest} PaySlipRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PaySlipRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PaySlipRequest message.
         * @function verify
         * @memberof omnora.PaySlipRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PaySlipRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                if (!$util.isString(message.nodeId))
                    return "nodeId: string expected";
            if (message.karigarId != null && message.hasOwnProperty("karigarId"))
                if (!$util.isString(message.karigarId))
                    return "karigarId: string expected";
            if (message.periodId != null && message.hasOwnProperty("periodId"))
                if (!$util.isString(message.periodId))
                    return "periodId: string expected";
            return null;
        };

        /**
         * Creates a PaySlipRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.PaySlipRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.PaySlipRequest} PaySlipRequest
         */
        PaySlipRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.PaySlipRequest)
                return object;
            var message = new $root.omnora.PaySlipRequest();
            if (object.nodeId != null)
                message.nodeId = String(object.nodeId);
            if (object.karigarId != null)
                message.karigarId = String(object.karigarId);
            if (object.periodId != null)
                message.periodId = String(object.periodId);
            return message;
        };

        /**
         * Creates a plain object from a PaySlipRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.PaySlipRequest
         * @static
         * @param {omnora.PaySlipRequest} message PaySlipRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PaySlipRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.nodeId = "";
                object.karigarId = "";
                object.periodId = "";
            }
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                object.nodeId = message.nodeId;
            if (message.karigarId != null && message.hasOwnProperty("karigarId"))
                object.karigarId = message.karigarId;
            if (message.periodId != null && message.hasOwnProperty("periodId"))
                object.periodId = message.periodId;
            return object;
        };

        /**
         * Converts this PaySlipRequest to JSON.
         * @function toJSON
         * @memberof omnora.PaySlipRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PaySlipRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PaySlipRequest;
    })();

    omnora.PaySlipResponse = (function() {

        /**
         * Properties of a PaySlipResponse.
         * @memberof omnora
         * @interface IPaySlipResponse
         * @property {string|null} [karigarName] PaySlipResponse karigarName
         * @property {string|null} [periodLabel] PaySlipResponse periodLabel
         * @property {string|null} [grossEarning] PaySlipResponse grossEarning
         * @property {string|null} [totalDeductions] PaySlipResponse totalDeductions
         * @property {string|null} [netPayable] PaySlipResponse netPayable
         * @property {number|null} [daysPresent] PaySlipResponse daysPresent
         * @property {string|null} [totalUnits] PaySlipResponse totalUnits
         * @property {string|null} [efficiencyPct] PaySlipResponse efficiencyPct
         * @property {string|null} [advanceDeduction] PaySlipResponse advanceDeduction
         */

        /**
         * Constructs a new PaySlipResponse.
         * @memberof omnora
         * @classdesc Represents a PaySlipResponse.
         * @implements IPaySlipResponse
         * @constructor
         * @param {omnora.IPaySlipResponse=} [properties] Properties to set
         */
        function PaySlipResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PaySlipResponse karigarName.
         * @member {string} karigarName
         * @memberof omnora.PaySlipResponse
         * @instance
         */
        PaySlipResponse.prototype.karigarName = "";

        /**
         * PaySlipResponse periodLabel.
         * @member {string} periodLabel
         * @memberof omnora.PaySlipResponse
         * @instance
         */
        PaySlipResponse.prototype.periodLabel = "";

        /**
         * PaySlipResponse grossEarning.
         * @member {string} grossEarning
         * @memberof omnora.PaySlipResponse
         * @instance
         */
        PaySlipResponse.prototype.grossEarning = "";

        /**
         * PaySlipResponse totalDeductions.
         * @member {string} totalDeductions
         * @memberof omnora.PaySlipResponse
         * @instance
         */
        PaySlipResponse.prototype.totalDeductions = "";

        /**
         * PaySlipResponse netPayable.
         * @member {string} netPayable
         * @memberof omnora.PaySlipResponse
         * @instance
         */
        PaySlipResponse.prototype.netPayable = "";

        /**
         * PaySlipResponse daysPresent.
         * @member {number} daysPresent
         * @memberof omnora.PaySlipResponse
         * @instance
         */
        PaySlipResponse.prototype.daysPresent = 0;

        /**
         * PaySlipResponse totalUnits.
         * @member {string} totalUnits
         * @memberof omnora.PaySlipResponse
         * @instance
         */
        PaySlipResponse.prototype.totalUnits = "";

        /**
         * PaySlipResponse efficiencyPct.
         * @member {string} efficiencyPct
         * @memberof omnora.PaySlipResponse
         * @instance
         */
        PaySlipResponse.prototype.efficiencyPct = "";

        /**
         * PaySlipResponse advanceDeduction.
         * @member {string} advanceDeduction
         * @memberof omnora.PaySlipResponse
         * @instance
         */
        PaySlipResponse.prototype.advanceDeduction = "";

        /**
         * Creates a new PaySlipResponse instance using the specified properties.
         * @function create
         * @memberof omnora.PaySlipResponse
         * @static
         * @param {omnora.IPaySlipResponse=} [properties] Properties to set
         * @returns {omnora.PaySlipResponse} PaySlipResponse instance
         */
        PaySlipResponse.create = function create(properties) {
            return new PaySlipResponse(properties);
        };

        /**
         * Encodes the specified PaySlipResponse message. Does not implicitly {@link omnora.PaySlipResponse.verify|verify} messages.
         * @function encode
         * @memberof omnora.PaySlipResponse
         * @static
         * @param {omnora.IPaySlipResponse} message PaySlipResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PaySlipResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.karigarName != null && Object.hasOwnProperty.call(message, "karigarName"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.karigarName);
            if (message.periodLabel != null && Object.hasOwnProperty.call(message, "periodLabel"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.periodLabel);
            if (message.grossEarning != null && Object.hasOwnProperty.call(message, "grossEarning"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.grossEarning);
            if (message.totalDeductions != null && Object.hasOwnProperty.call(message, "totalDeductions"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.totalDeductions);
            if (message.netPayable != null && Object.hasOwnProperty.call(message, "netPayable"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.netPayable);
            if (message.daysPresent != null && Object.hasOwnProperty.call(message, "daysPresent"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.daysPresent);
            if (message.totalUnits != null && Object.hasOwnProperty.call(message, "totalUnits"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.totalUnits);
            if (message.efficiencyPct != null && Object.hasOwnProperty.call(message, "efficiencyPct"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.efficiencyPct);
            if (message.advanceDeduction != null && Object.hasOwnProperty.call(message, "advanceDeduction"))
                writer.uint32(/* id 9, wireType 2 =*/74).string(message.advanceDeduction);
            return writer;
        };

        /**
         * Encodes the specified PaySlipResponse message, length delimited. Does not implicitly {@link omnora.PaySlipResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.PaySlipResponse
         * @static
         * @param {omnora.IPaySlipResponse} message PaySlipResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PaySlipResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PaySlipResponse message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.PaySlipResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.PaySlipResponse} PaySlipResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PaySlipResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.PaySlipResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.karigarName = reader.string();
                    break;
                case 2:
                    message.periodLabel = reader.string();
                    break;
                case 3:
                    message.grossEarning = reader.string();
                    break;
                case 4:
                    message.totalDeductions = reader.string();
                    break;
                case 5:
                    message.netPayable = reader.string();
                    break;
                case 6:
                    message.daysPresent = reader.int32();
                    break;
                case 7:
                    message.totalUnits = reader.string();
                    break;
                case 8:
                    message.efficiencyPct = reader.string();
                    break;
                case 9:
                    message.advanceDeduction = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PaySlipResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.PaySlipResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.PaySlipResponse} PaySlipResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PaySlipResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PaySlipResponse message.
         * @function verify
         * @memberof omnora.PaySlipResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PaySlipResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.karigarName != null && message.hasOwnProperty("karigarName"))
                if (!$util.isString(message.karigarName))
                    return "karigarName: string expected";
            if (message.periodLabel != null && message.hasOwnProperty("periodLabel"))
                if (!$util.isString(message.periodLabel))
                    return "periodLabel: string expected";
            if (message.grossEarning != null && message.hasOwnProperty("grossEarning"))
                if (!$util.isString(message.grossEarning))
                    return "grossEarning: string expected";
            if (message.totalDeductions != null && message.hasOwnProperty("totalDeductions"))
                if (!$util.isString(message.totalDeductions))
                    return "totalDeductions: string expected";
            if (message.netPayable != null && message.hasOwnProperty("netPayable"))
                if (!$util.isString(message.netPayable))
                    return "netPayable: string expected";
            if (message.daysPresent != null && message.hasOwnProperty("daysPresent"))
                if (!$util.isInteger(message.daysPresent))
                    return "daysPresent: integer expected";
            if (message.totalUnits != null && message.hasOwnProperty("totalUnits"))
                if (!$util.isString(message.totalUnits))
                    return "totalUnits: string expected";
            if (message.efficiencyPct != null && message.hasOwnProperty("efficiencyPct"))
                if (!$util.isString(message.efficiencyPct))
                    return "efficiencyPct: string expected";
            if (message.advanceDeduction != null && message.hasOwnProperty("advanceDeduction"))
                if (!$util.isString(message.advanceDeduction))
                    return "advanceDeduction: string expected";
            return null;
        };

        /**
         * Creates a PaySlipResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.PaySlipResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.PaySlipResponse} PaySlipResponse
         */
        PaySlipResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.PaySlipResponse)
                return object;
            var message = new $root.omnora.PaySlipResponse();
            if (object.karigarName != null)
                message.karigarName = String(object.karigarName);
            if (object.periodLabel != null)
                message.periodLabel = String(object.periodLabel);
            if (object.grossEarning != null)
                message.grossEarning = String(object.grossEarning);
            if (object.totalDeductions != null)
                message.totalDeductions = String(object.totalDeductions);
            if (object.netPayable != null)
                message.netPayable = String(object.netPayable);
            if (object.daysPresent != null)
                message.daysPresent = object.daysPresent | 0;
            if (object.totalUnits != null)
                message.totalUnits = String(object.totalUnits);
            if (object.efficiencyPct != null)
                message.efficiencyPct = String(object.efficiencyPct);
            if (object.advanceDeduction != null)
                message.advanceDeduction = String(object.advanceDeduction);
            return message;
        };

        /**
         * Creates a plain object from a PaySlipResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.PaySlipResponse
         * @static
         * @param {omnora.PaySlipResponse} message PaySlipResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PaySlipResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.karigarName = "";
                object.periodLabel = "";
                object.grossEarning = "";
                object.totalDeductions = "";
                object.netPayable = "";
                object.daysPresent = 0;
                object.totalUnits = "";
                object.efficiencyPct = "";
                object.advanceDeduction = "";
            }
            if (message.karigarName != null && message.hasOwnProperty("karigarName"))
                object.karigarName = message.karigarName;
            if (message.periodLabel != null && message.hasOwnProperty("periodLabel"))
                object.periodLabel = message.periodLabel;
            if (message.grossEarning != null && message.hasOwnProperty("grossEarning"))
                object.grossEarning = message.grossEarning;
            if (message.totalDeductions != null && message.hasOwnProperty("totalDeductions"))
                object.totalDeductions = message.totalDeductions;
            if (message.netPayable != null && message.hasOwnProperty("netPayable"))
                object.netPayable = message.netPayable;
            if (message.daysPresent != null && message.hasOwnProperty("daysPresent"))
                object.daysPresent = message.daysPresent;
            if (message.totalUnits != null && message.hasOwnProperty("totalUnits"))
                object.totalUnits = message.totalUnits;
            if (message.efficiencyPct != null && message.hasOwnProperty("efficiencyPct"))
                object.efficiencyPct = message.efficiencyPct;
            if (message.advanceDeduction != null && message.hasOwnProperty("advanceDeduction"))
                object.advanceDeduction = message.advanceDeduction;
            return object;
        };

        /**
         * Converts this PaySlipResponse to JSON.
         * @function toJSON
         * @memberof omnora.PaySlipResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PaySlipResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PaySlipResponse;
    })();

    omnora.BranchListRequest = (function() {

        /**
         * Properties of a BranchListRequest.
         * @memberof omnora
         * @interface IBranchListRequest
         * @property {string|null} [nodeId] BranchListRequest nodeId
         */

        /**
         * Constructs a new BranchListRequest.
         * @memberof omnora
         * @classdesc Represents a BranchListRequest.
         * @implements IBranchListRequest
         * @constructor
         * @param {omnora.IBranchListRequest=} [properties] Properties to set
         */
        function BranchListRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BranchListRequest nodeId.
         * @member {string} nodeId
         * @memberof omnora.BranchListRequest
         * @instance
         */
        BranchListRequest.prototype.nodeId = "";

        /**
         * Creates a new BranchListRequest instance using the specified properties.
         * @function create
         * @memberof omnora.BranchListRequest
         * @static
         * @param {omnora.IBranchListRequest=} [properties] Properties to set
         * @returns {omnora.BranchListRequest} BranchListRequest instance
         */
        BranchListRequest.create = function create(properties) {
            return new BranchListRequest(properties);
        };

        /**
         * Encodes the specified BranchListRequest message. Does not implicitly {@link omnora.BranchListRequest.verify|verify} messages.
         * @function encode
         * @memberof omnora.BranchListRequest
         * @static
         * @param {omnora.IBranchListRequest} message BranchListRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BranchListRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nodeId != null && Object.hasOwnProperty.call(message, "nodeId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.nodeId);
            return writer;
        };

        /**
         * Encodes the specified BranchListRequest message, length delimited. Does not implicitly {@link omnora.BranchListRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.BranchListRequest
         * @static
         * @param {omnora.IBranchListRequest} message BranchListRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BranchListRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BranchListRequest message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.BranchListRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.BranchListRequest} BranchListRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BranchListRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.BranchListRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nodeId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BranchListRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.BranchListRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.BranchListRequest} BranchListRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BranchListRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BranchListRequest message.
         * @function verify
         * @memberof omnora.BranchListRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BranchListRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                if (!$util.isString(message.nodeId))
                    return "nodeId: string expected";
            return null;
        };

        /**
         * Creates a BranchListRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.BranchListRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.BranchListRequest} BranchListRequest
         */
        BranchListRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.BranchListRequest)
                return object;
            var message = new $root.omnora.BranchListRequest();
            if (object.nodeId != null)
                message.nodeId = String(object.nodeId);
            return message;
        };

        /**
         * Creates a plain object from a BranchListRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.BranchListRequest
         * @static
         * @param {omnora.BranchListRequest} message BranchListRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BranchListRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.nodeId = "";
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                object.nodeId = message.nodeId;
            return object;
        };

        /**
         * Converts this BranchListRequest to JSON.
         * @function toJSON
         * @memberof omnora.BranchListRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BranchListRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BranchListRequest;
    })();

    omnora.BranchListResponse = (function() {

        /**
         * Properties of a BranchListResponse.
         * @memberof omnora
         * @interface IBranchListResponse
         * @property {Array.<omnora.IBranchItem>|null} [branches] BranchListResponse branches
         * @property {string|null} [currentBranchId] BranchListResponse currentBranchId
         */

        /**
         * Constructs a new BranchListResponse.
         * @memberof omnora
         * @classdesc Represents a BranchListResponse.
         * @implements IBranchListResponse
         * @constructor
         * @param {omnora.IBranchListResponse=} [properties] Properties to set
         */
        function BranchListResponse(properties) {
            this.branches = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BranchListResponse branches.
         * @member {Array.<omnora.IBranchItem>} branches
         * @memberof omnora.BranchListResponse
         * @instance
         */
        BranchListResponse.prototype.branches = $util.emptyArray;

        /**
         * BranchListResponse currentBranchId.
         * @member {string} currentBranchId
         * @memberof omnora.BranchListResponse
         * @instance
         */
        BranchListResponse.prototype.currentBranchId = "";

        /**
         * Creates a new BranchListResponse instance using the specified properties.
         * @function create
         * @memberof omnora.BranchListResponse
         * @static
         * @param {omnora.IBranchListResponse=} [properties] Properties to set
         * @returns {omnora.BranchListResponse} BranchListResponse instance
         */
        BranchListResponse.create = function create(properties) {
            return new BranchListResponse(properties);
        };

        /**
         * Encodes the specified BranchListResponse message. Does not implicitly {@link omnora.BranchListResponse.verify|verify} messages.
         * @function encode
         * @memberof omnora.BranchListResponse
         * @static
         * @param {omnora.IBranchListResponse} message BranchListResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BranchListResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.branches != null && message.branches.length)
                for (var i = 0; i < message.branches.length; ++i)
                    $root.omnora.BranchItem.encode(message.branches[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.currentBranchId != null && Object.hasOwnProperty.call(message, "currentBranchId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.currentBranchId);
            return writer;
        };

        /**
         * Encodes the specified BranchListResponse message, length delimited. Does not implicitly {@link omnora.BranchListResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.BranchListResponse
         * @static
         * @param {omnora.IBranchListResponse} message BranchListResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BranchListResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BranchListResponse message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.BranchListResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.BranchListResponse} BranchListResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BranchListResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.BranchListResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.branches && message.branches.length))
                        message.branches = [];
                    message.branches.push($root.omnora.BranchItem.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.currentBranchId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BranchListResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.BranchListResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.BranchListResponse} BranchListResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BranchListResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BranchListResponse message.
         * @function verify
         * @memberof omnora.BranchListResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BranchListResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.branches != null && message.hasOwnProperty("branches")) {
                if (!Array.isArray(message.branches))
                    return "branches: array expected";
                for (var i = 0; i < message.branches.length; ++i) {
                    var error = $root.omnora.BranchItem.verify(message.branches[i]);
                    if (error)
                        return "branches." + error;
                }
            }
            if (message.currentBranchId != null && message.hasOwnProperty("currentBranchId"))
                if (!$util.isString(message.currentBranchId))
                    return "currentBranchId: string expected";
            return null;
        };

        /**
         * Creates a BranchListResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.BranchListResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.BranchListResponse} BranchListResponse
         */
        BranchListResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.BranchListResponse)
                return object;
            var message = new $root.omnora.BranchListResponse();
            if (object.branches) {
                if (!Array.isArray(object.branches))
                    throw TypeError(".omnora.BranchListResponse.branches: array expected");
                message.branches = [];
                for (var i = 0; i < object.branches.length; ++i) {
                    if (typeof object.branches[i] !== "object")
                        throw TypeError(".omnora.BranchListResponse.branches: object expected");
                    message.branches[i] = $root.omnora.BranchItem.fromObject(object.branches[i]);
                }
            }
            if (object.currentBranchId != null)
                message.currentBranchId = String(object.currentBranchId);
            return message;
        };

        /**
         * Creates a plain object from a BranchListResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.BranchListResponse
         * @static
         * @param {omnora.BranchListResponse} message BranchListResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BranchListResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.branches = [];
            if (options.defaults)
                object.currentBranchId = "";
            if (message.branches && message.branches.length) {
                object.branches = [];
                for (var j = 0; j < message.branches.length; ++j)
                    object.branches[j] = $root.omnora.BranchItem.toObject(message.branches[j], options);
            }
            if (message.currentBranchId != null && message.hasOwnProperty("currentBranchId"))
                object.currentBranchId = message.currentBranchId;
            return object;
        };

        /**
         * Converts this BranchListResponse to JSON.
         * @function toJSON
         * @memberof omnora.BranchListResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BranchListResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BranchListResponse;
    })();

    omnora.BranchItem = (function() {

        /**
         * Properties of a BranchItem.
         * @memberof omnora
         * @interface IBranchItem
         * @property {string|null} [branchId] BranchItem branchId
         * @property {string|null} [name] BranchItem name
         * @property {string|null} [city] BranchItem city
         * @property {boolean|null} [isHq] BranchItem isHq
         * @property {string|null} [userRoleAtBranch] BranchItem userRoleAtBranch
         */

        /**
         * Constructs a new BranchItem.
         * @memberof omnora
         * @classdesc Represents a BranchItem.
         * @implements IBranchItem
         * @constructor
         * @param {omnora.IBranchItem=} [properties] Properties to set
         */
        function BranchItem(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BranchItem branchId.
         * @member {string} branchId
         * @memberof omnora.BranchItem
         * @instance
         */
        BranchItem.prototype.branchId = "";

        /**
         * BranchItem name.
         * @member {string} name
         * @memberof omnora.BranchItem
         * @instance
         */
        BranchItem.prototype.name = "";

        /**
         * BranchItem city.
         * @member {string} city
         * @memberof omnora.BranchItem
         * @instance
         */
        BranchItem.prototype.city = "";

        /**
         * BranchItem isHq.
         * @member {boolean} isHq
         * @memberof omnora.BranchItem
         * @instance
         */
        BranchItem.prototype.isHq = false;

        /**
         * BranchItem userRoleAtBranch.
         * @member {string} userRoleAtBranch
         * @memberof omnora.BranchItem
         * @instance
         */
        BranchItem.prototype.userRoleAtBranch = "";

        /**
         * Creates a new BranchItem instance using the specified properties.
         * @function create
         * @memberof omnora.BranchItem
         * @static
         * @param {omnora.IBranchItem=} [properties] Properties to set
         * @returns {omnora.BranchItem} BranchItem instance
         */
        BranchItem.create = function create(properties) {
            return new BranchItem(properties);
        };

        /**
         * Encodes the specified BranchItem message. Does not implicitly {@link omnora.BranchItem.verify|verify} messages.
         * @function encode
         * @memberof omnora.BranchItem
         * @static
         * @param {omnora.IBranchItem} message BranchItem message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BranchItem.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.branchId != null && Object.hasOwnProperty.call(message, "branchId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.branchId);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.city != null && Object.hasOwnProperty.call(message, "city"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.city);
            if (message.isHq != null && Object.hasOwnProperty.call(message, "isHq"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.isHq);
            if (message.userRoleAtBranch != null && Object.hasOwnProperty.call(message, "userRoleAtBranch"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.userRoleAtBranch);
            return writer;
        };

        /**
         * Encodes the specified BranchItem message, length delimited. Does not implicitly {@link omnora.BranchItem.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.BranchItem
         * @static
         * @param {omnora.IBranchItem} message BranchItem message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BranchItem.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BranchItem message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.BranchItem
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.BranchItem} BranchItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BranchItem.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.BranchItem();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.branchId = reader.string();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                case 3:
                    message.city = reader.string();
                    break;
                case 4:
                    message.isHq = reader.bool();
                    break;
                case 5:
                    message.userRoleAtBranch = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BranchItem message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.BranchItem
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.BranchItem} BranchItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BranchItem.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BranchItem message.
         * @function verify
         * @memberof omnora.BranchItem
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BranchItem.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.branchId != null && message.hasOwnProperty("branchId"))
                if (!$util.isString(message.branchId))
                    return "branchId: string expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.city != null && message.hasOwnProperty("city"))
                if (!$util.isString(message.city))
                    return "city: string expected";
            if (message.isHq != null && message.hasOwnProperty("isHq"))
                if (typeof message.isHq !== "boolean")
                    return "isHq: boolean expected";
            if (message.userRoleAtBranch != null && message.hasOwnProperty("userRoleAtBranch"))
                if (!$util.isString(message.userRoleAtBranch))
                    return "userRoleAtBranch: string expected";
            return null;
        };

        /**
         * Creates a BranchItem message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.BranchItem
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.BranchItem} BranchItem
         */
        BranchItem.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.BranchItem)
                return object;
            var message = new $root.omnora.BranchItem();
            if (object.branchId != null)
                message.branchId = String(object.branchId);
            if (object.name != null)
                message.name = String(object.name);
            if (object.city != null)
                message.city = String(object.city);
            if (object.isHq != null)
                message.isHq = Boolean(object.isHq);
            if (object.userRoleAtBranch != null)
                message.userRoleAtBranch = String(object.userRoleAtBranch);
            return message;
        };

        /**
         * Creates a plain object from a BranchItem message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.BranchItem
         * @static
         * @param {omnora.BranchItem} message BranchItem
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BranchItem.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.branchId = "";
                object.name = "";
                object.city = "";
                object.isHq = false;
                object.userRoleAtBranch = "";
            }
            if (message.branchId != null && message.hasOwnProperty("branchId"))
                object.branchId = message.branchId;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.city != null && message.hasOwnProperty("city"))
                object.city = message.city;
            if (message.isHq != null && message.hasOwnProperty("isHq"))
                object.isHq = message.isHq;
            if (message.userRoleAtBranch != null && message.hasOwnProperty("userRoleAtBranch"))
                object.userRoleAtBranch = message.userRoleAtBranch;
            return object;
        };

        /**
         * Converts this BranchItem to JSON.
         * @function toJSON
         * @memberof omnora.BranchItem
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BranchItem.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BranchItem;
    })();

    omnora.SwitchBranchRequest = (function() {

        /**
         * Properties of a SwitchBranchRequest.
         * @memberof omnora
         * @interface ISwitchBranchRequest
         * @property {string|null} [nodeId] SwitchBranchRequest nodeId
         * @property {string|null} [targetBranchId] SwitchBranchRequest targetBranchId
         */

        /**
         * Constructs a new SwitchBranchRequest.
         * @memberof omnora
         * @classdesc Represents a SwitchBranchRequest.
         * @implements ISwitchBranchRequest
         * @constructor
         * @param {omnora.ISwitchBranchRequest=} [properties] Properties to set
         */
        function SwitchBranchRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SwitchBranchRequest nodeId.
         * @member {string} nodeId
         * @memberof omnora.SwitchBranchRequest
         * @instance
         */
        SwitchBranchRequest.prototype.nodeId = "";

        /**
         * SwitchBranchRequest targetBranchId.
         * @member {string} targetBranchId
         * @memberof omnora.SwitchBranchRequest
         * @instance
         */
        SwitchBranchRequest.prototype.targetBranchId = "";

        /**
         * Creates a new SwitchBranchRequest instance using the specified properties.
         * @function create
         * @memberof omnora.SwitchBranchRequest
         * @static
         * @param {omnora.ISwitchBranchRequest=} [properties] Properties to set
         * @returns {omnora.SwitchBranchRequest} SwitchBranchRequest instance
         */
        SwitchBranchRequest.create = function create(properties) {
            return new SwitchBranchRequest(properties);
        };

        /**
         * Encodes the specified SwitchBranchRequest message. Does not implicitly {@link omnora.SwitchBranchRequest.verify|verify} messages.
         * @function encode
         * @memberof omnora.SwitchBranchRequest
         * @static
         * @param {omnora.ISwitchBranchRequest} message SwitchBranchRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SwitchBranchRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nodeId != null && Object.hasOwnProperty.call(message, "nodeId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.nodeId);
            if (message.targetBranchId != null && Object.hasOwnProperty.call(message, "targetBranchId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.targetBranchId);
            return writer;
        };

        /**
         * Encodes the specified SwitchBranchRequest message, length delimited. Does not implicitly {@link omnora.SwitchBranchRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.SwitchBranchRequest
         * @static
         * @param {omnora.ISwitchBranchRequest} message SwitchBranchRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SwitchBranchRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SwitchBranchRequest message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.SwitchBranchRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.SwitchBranchRequest} SwitchBranchRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SwitchBranchRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.SwitchBranchRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nodeId = reader.string();
                    break;
                case 2:
                    message.targetBranchId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SwitchBranchRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.SwitchBranchRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.SwitchBranchRequest} SwitchBranchRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SwitchBranchRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SwitchBranchRequest message.
         * @function verify
         * @memberof omnora.SwitchBranchRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SwitchBranchRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                if (!$util.isString(message.nodeId))
                    return "nodeId: string expected";
            if (message.targetBranchId != null && message.hasOwnProperty("targetBranchId"))
                if (!$util.isString(message.targetBranchId))
                    return "targetBranchId: string expected";
            return null;
        };

        /**
         * Creates a SwitchBranchRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.SwitchBranchRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.SwitchBranchRequest} SwitchBranchRequest
         */
        SwitchBranchRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.SwitchBranchRequest)
                return object;
            var message = new $root.omnora.SwitchBranchRequest();
            if (object.nodeId != null)
                message.nodeId = String(object.nodeId);
            if (object.targetBranchId != null)
                message.targetBranchId = String(object.targetBranchId);
            return message;
        };

        /**
         * Creates a plain object from a SwitchBranchRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.SwitchBranchRequest
         * @static
         * @param {omnora.SwitchBranchRequest} message SwitchBranchRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SwitchBranchRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.nodeId = "";
                object.targetBranchId = "";
            }
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                object.nodeId = message.nodeId;
            if (message.targetBranchId != null && message.hasOwnProperty("targetBranchId"))
                object.targetBranchId = message.targetBranchId;
            return object;
        };

        /**
         * Converts this SwitchBranchRequest to JSON.
         * @function toJSON
         * @memberof omnora.SwitchBranchRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SwitchBranchRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SwitchBranchRequest;
    })();

    omnora.SwitchBranchResponse = (function() {

        /**
         * Properties of a SwitchBranchResponse.
         * @memberof omnora
         * @interface ISwitchBranchResponse
         * @property {boolean|null} [success] SwitchBranchResponse success
         * @property {string|null} [newJwt] SwitchBranchResponse newJwt
         * @property {string|null} [branchName] SwitchBranchResponse branchName
         */

        /**
         * Constructs a new SwitchBranchResponse.
         * @memberof omnora
         * @classdesc Represents a SwitchBranchResponse.
         * @implements ISwitchBranchResponse
         * @constructor
         * @param {omnora.ISwitchBranchResponse=} [properties] Properties to set
         */
        function SwitchBranchResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SwitchBranchResponse success.
         * @member {boolean} success
         * @memberof omnora.SwitchBranchResponse
         * @instance
         */
        SwitchBranchResponse.prototype.success = false;

        /**
         * SwitchBranchResponse newJwt.
         * @member {string} newJwt
         * @memberof omnora.SwitchBranchResponse
         * @instance
         */
        SwitchBranchResponse.prototype.newJwt = "";

        /**
         * SwitchBranchResponse branchName.
         * @member {string} branchName
         * @memberof omnora.SwitchBranchResponse
         * @instance
         */
        SwitchBranchResponse.prototype.branchName = "";

        /**
         * Creates a new SwitchBranchResponse instance using the specified properties.
         * @function create
         * @memberof omnora.SwitchBranchResponse
         * @static
         * @param {omnora.ISwitchBranchResponse=} [properties] Properties to set
         * @returns {omnora.SwitchBranchResponse} SwitchBranchResponse instance
         */
        SwitchBranchResponse.create = function create(properties) {
            return new SwitchBranchResponse(properties);
        };

        /**
         * Encodes the specified SwitchBranchResponse message. Does not implicitly {@link omnora.SwitchBranchResponse.verify|verify} messages.
         * @function encode
         * @memberof omnora.SwitchBranchResponse
         * @static
         * @param {omnora.ISwitchBranchResponse} message SwitchBranchResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SwitchBranchResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && Object.hasOwnProperty.call(message, "success"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
            if (message.newJwt != null && Object.hasOwnProperty.call(message, "newJwt"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.newJwt);
            if (message.branchName != null && Object.hasOwnProperty.call(message, "branchName"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.branchName);
            return writer;
        };

        /**
         * Encodes the specified SwitchBranchResponse message, length delimited. Does not implicitly {@link omnora.SwitchBranchResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.SwitchBranchResponse
         * @static
         * @param {omnora.ISwitchBranchResponse} message SwitchBranchResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SwitchBranchResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SwitchBranchResponse message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.SwitchBranchResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.SwitchBranchResponse} SwitchBranchResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SwitchBranchResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.SwitchBranchResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.success = reader.bool();
                    break;
                case 2:
                    message.newJwt = reader.string();
                    break;
                case 3:
                    message.branchName = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SwitchBranchResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.SwitchBranchResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.SwitchBranchResponse} SwitchBranchResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SwitchBranchResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SwitchBranchResponse message.
         * @function verify
         * @memberof omnora.SwitchBranchResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SwitchBranchResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.success != null && message.hasOwnProperty("success"))
                if (typeof message.success !== "boolean")
                    return "success: boolean expected";
            if (message.newJwt != null && message.hasOwnProperty("newJwt"))
                if (!$util.isString(message.newJwt))
                    return "newJwt: string expected";
            if (message.branchName != null && message.hasOwnProperty("branchName"))
                if (!$util.isString(message.branchName))
                    return "branchName: string expected";
            return null;
        };

        /**
         * Creates a SwitchBranchResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.SwitchBranchResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.SwitchBranchResponse} SwitchBranchResponse
         */
        SwitchBranchResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.SwitchBranchResponse)
                return object;
            var message = new $root.omnora.SwitchBranchResponse();
            if (object.success != null)
                message.success = Boolean(object.success);
            if (object.newJwt != null)
                message.newJwt = String(object.newJwt);
            if (object.branchName != null)
                message.branchName = String(object.branchName);
            return message;
        };

        /**
         * Creates a plain object from a SwitchBranchResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.SwitchBranchResponse
         * @static
         * @param {omnora.SwitchBranchResponse} message SwitchBranchResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SwitchBranchResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.success = false;
                object.newJwt = "";
                object.branchName = "";
            }
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = message.success;
            if (message.newJwt != null && message.hasOwnProperty("newJwt"))
                object.newJwt = message.newJwt;
            if (message.branchName != null && message.hasOwnProperty("branchName"))
                object.branchName = message.branchName;
            return object;
        };

        /**
         * Converts this SwitchBranchResponse to JSON.
         * @function toJSON
         * @memberof omnora.SwitchBranchResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SwitchBranchResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SwitchBranchResponse;
    })();

    omnora.ScanEvent = (function() {

        /**
         * Properties of a ScanEvent.
         * @memberof omnora
         * @interface IScanEvent
         * @property {string|null} [nodeId] ScanEvent nodeId
         * @property {string|null} [workerId] ScanEvent workerId
         * @property {string|null} [barcode] ScanEvent barcode
         * @property {number|Long|null} [timestamp] ScanEvent timestamp
         * @property {string|null} [batchId] ScanEvent batchId
         */

        /**
         * Constructs a new ScanEvent.
         * @memberof omnora
         * @classdesc Represents a ScanEvent.
         * @implements IScanEvent
         * @constructor
         * @param {omnora.IScanEvent=} [properties] Properties to set
         */
        function ScanEvent(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ScanEvent nodeId.
         * @member {string} nodeId
         * @memberof omnora.ScanEvent
         * @instance
         */
        ScanEvent.prototype.nodeId = "";

        /**
         * ScanEvent workerId.
         * @member {string} workerId
         * @memberof omnora.ScanEvent
         * @instance
         */
        ScanEvent.prototype.workerId = "";

        /**
         * ScanEvent barcode.
         * @member {string} barcode
         * @memberof omnora.ScanEvent
         * @instance
         */
        ScanEvent.prototype.barcode = "";

        /**
         * ScanEvent timestamp.
         * @member {number|Long} timestamp
         * @memberof omnora.ScanEvent
         * @instance
         */
        ScanEvent.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * ScanEvent batchId.
         * @member {string} batchId
         * @memberof omnora.ScanEvent
         * @instance
         */
        ScanEvent.prototype.batchId = "";

        /**
         * Creates a new ScanEvent instance using the specified properties.
         * @function create
         * @memberof omnora.ScanEvent
         * @static
         * @param {omnora.IScanEvent=} [properties] Properties to set
         * @returns {omnora.ScanEvent} ScanEvent instance
         */
        ScanEvent.create = function create(properties) {
            return new ScanEvent(properties);
        };

        /**
         * Encodes the specified ScanEvent message. Does not implicitly {@link omnora.ScanEvent.verify|verify} messages.
         * @function encode
         * @memberof omnora.ScanEvent
         * @static
         * @param {omnora.IScanEvent} message ScanEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ScanEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nodeId != null && Object.hasOwnProperty.call(message, "nodeId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.nodeId);
            if (message.workerId != null && Object.hasOwnProperty.call(message, "workerId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.workerId);
            if (message.barcode != null && Object.hasOwnProperty.call(message, "barcode"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.barcode);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 4, wireType 0 =*/32).int64(message.timestamp);
            if (message.batchId != null && Object.hasOwnProperty.call(message, "batchId"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.batchId);
            return writer;
        };

        /**
         * Encodes the specified ScanEvent message, length delimited. Does not implicitly {@link omnora.ScanEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.ScanEvent
         * @static
         * @param {omnora.IScanEvent} message ScanEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ScanEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ScanEvent message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.ScanEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.ScanEvent} ScanEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ScanEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.ScanEvent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nodeId = reader.string();
                    break;
                case 2:
                    message.workerId = reader.string();
                    break;
                case 3:
                    message.barcode = reader.string();
                    break;
                case 4:
                    message.timestamp = reader.int64();
                    break;
                case 5:
                    message.batchId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ScanEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.ScanEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.ScanEvent} ScanEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ScanEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ScanEvent message.
         * @function verify
         * @memberof omnora.ScanEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ScanEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                if (!$util.isString(message.nodeId))
                    return "nodeId: string expected";
            if (message.workerId != null && message.hasOwnProperty("workerId"))
                if (!$util.isString(message.workerId))
                    return "workerId: string expected";
            if (message.barcode != null && message.hasOwnProperty("barcode"))
                if (!$util.isString(message.barcode))
                    return "barcode: string expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.batchId != null && message.hasOwnProperty("batchId"))
                if (!$util.isString(message.batchId))
                    return "batchId: string expected";
            return null;
        };

        /**
         * Creates a ScanEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.ScanEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.ScanEvent} ScanEvent
         */
        ScanEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.ScanEvent)
                return object;
            var message = new $root.omnora.ScanEvent();
            if (object.nodeId != null)
                message.nodeId = String(object.nodeId);
            if (object.workerId != null)
                message.workerId = String(object.workerId);
            if (object.barcode != null)
                message.barcode = String(object.barcode);
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            if (object.batchId != null)
                message.batchId = String(object.batchId);
            return message;
        };

        /**
         * Creates a plain object from a ScanEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.ScanEvent
         * @static
         * @param {omnora.ScanEvent} message ScanEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ScanEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.nodeId = "";
                object.workerId = "";
                object.barcode = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                object.batchId = "";
            }
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                object.nodeId = message.nodeId;
            if (message.workerId != null && message.hasOwnProperty("workerId"))
                object.workerId = message.workerId;
            if (message.barcode != null && message.hasOwnProperty("barcode"))
                object.barcode = message.barcode;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            if (message.batchId != null && message.hasOwnProperty("batchId"))
                object.batchId = message.batchId;
            return object;
        };

        /**
         * Converts this ScanEvent to JSON.
         * @function toJSON
         * @memberof omnora.ScanEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ScanEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ScanEvent;
    })();

    omnora.HeartbeatEvent = (function() {

        /**
         * Properties of a HeartbeatEvent.
         * @memberof omnora
         * @interface IHeartbeatEvent
         * @property {string|null} [nodeId] HeartbeatEvent nodeId
         * @property {number|Long|null} [timestamp] HeartbeatEvent timestamp
         * @property {number|null} [batteryPercent] HeartbeatEvent batteryPercent
         * @property {number|null} [signalStrength] HeartbeatEvent signalStrength
         * @property {number|null} [queueDepth] HeartbeatEvent queueDepth
         */

        /**
         * Constructs a new HeartbeatEvent.
         * @memberof omnora
         * @classdesc Represents a HeartbeatEvent.
         * @implements IHeartbeatEvent
         * @constructor
         * @param {omnora.IHeartbeatEvent=} [properties] Properties to set
         */
        function HeartbeatEvent(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HeartbeatEvent nodeId.
         * @member {string} nodeId
         * @memberof omnora.HeartbeatEvent
         * @instance
         */
        HeartbeatEvent.prototype.nodeId = "";

        /**
         * HeartbeatEvent timestamp.
         * @member {number|Long} timestamp
         * @memberof omnora.HeartbeatEvent
         * @instance
         */
        HeartbeatEvent.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * HeartbeatEvent batteryPercent.
         * @member {number} batteryPercent
         * @memberof omnora.HeartbeatEvent
         * @instance
         */
        HeartbeatEvent.prototype.batteryPercent = 0;

        /**
         * HeartbeatEvent signalStrength.
         * @member {number} signalStrength
         * @memberof omnora.HeartbeatEvent
         * @instance
         */
        HeartbeatEvent.prototype.signalStrength = 0;

        /**
         * HeartbeatEvent queueDepth.
         * @member {number} queueDepth
         * @memberof omnora.HeartbeatEvent
         * @instance
         */
        HeartbeatEvent.prototype.queueDepth = 0;

        /**
         * Creates a new HeartbeatEvent instance using the specified properties.
         * @function create
         * @memberof omnora.HeartbeatEvent
         * @static
         * @param {omnora.IHeartbeatEvent=} [properties] Properties to set
         * @returns {omnora.HeartbeatEvent} HeartbeatEvent instance
         */
        HeartbeatEvent.create = function create(properties) {
            return new HeartbeatEvent(properties);
        };

        /**
         * Encodes the specified HeartbeatEvent message. Does not implicitly {@link omnora.HeartbeatEvent.verify|verify} messages.
         * @function encode
         * @memberof omnora.HeartbeatEvent
         * @static
         * @param {omnora.IHeartbeatEvent} message HeartbeatEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HeartbeatEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nodeId != null && Object.hasOwnProperty.call(message, "nodeId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.nodeId);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.timestamp);
            if (message.batteryPercent != null && Object.hasOwnProperty.call(message, "batteryPercent"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.batteryPercent);
            if (message.signalStrength != null && Object.hasOwnProperty.call(message, "signalStrength"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.signalStrength);
            if (message.queueDepth != null && Object.hasOwnProperty.call(message, "queueDepth"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.queueDepth);
            return writer;
        };

        /**
         * Encodes the specified HeartbeatEvent message, length delimited. Does not implicitly {@link omnora.HeartbeatEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.HeartbeatEvent
         * @static
         * @param {omnora.IHeartbeatEvent} message HeartbeatEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HeartbeatEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HeartbeatEvent message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.HeartbeatEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.HeartbeatEvent} HeartbeatEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HeartbeatEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.HeartbeatEvent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nodeId = reader.string();
                    break;
                case 2:
                    message.timestamp = reader.int64();
                    break;
                case 3:
                    message.batteryPercent = reader.int32();
                    break;
                case 4:
                    message.signalStrength = reader.int32();
                    break;
                case 5:
                    message.queueDepth = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a HeartbeatEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.HeartbeatEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.HeartbeatEvent} HeartbeatEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HeartbeatEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HeartbeatEvent message.
         * @function verify
         * @memberof omnora.HeartbeatEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HeartbeatEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                if (!$util.isString(message.nodeId))
                    return "nodeId: string expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.batteryPercent != null && message.hasOwnProperty("batteryPercent"))
                if (!$util.isInteger(message.batteryPercent))
                    return "batteryPercent: integer expected";
            if (message.signalStrength != null && message.hasOwnProperty("signalStrength"))
                if (!$util.isInteger(message.signalStrength))
                    return "signalStrength: integer expected";
            if (message.queueDepth != null && message.hasOwnProperty("queueDepth"))
                if (!$util.isInteger(message.queueDepth))
                    return "queueDepth: integer expected";
            return null;
        };

        /**
         * Creates a HeartbeatEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.HeartbeatEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.HeartbeatEvent} HeartbeatEvent
         */
        HeartbeatEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.HeartbeatEvent)
                return object;
            var message = new $root.omnora.HeartbeatEvent();
            if (object.nodeId != null)
                message.nodeId = String(object.nodeId);
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            if (object.batteryPercent != null)
                message.batteryPercent = object.batteryPercent | 0;
            if (object.signalStrength != null)
                message.signalStrength = object.signalStrength | 0;
            if (object.queueDepth != null)
                message.queueDepth = object.queueDepth | 0;
            return message;
        };

        /**
         * Creates a plain object from a HeartbeatEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.HeartbeatEvent
         * @static
         * @param {omnora.HeartbeatEvent} message HeartbeatEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HeartbeatEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.nodeId = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                object.batteryPercent = 0;
                object.signalStrength = 0;
                object.queueDepth = 0;
            }
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                object.nodeId = message.nodeId;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            if (message.batteryPercent != null && message.hasOwnProperty("batteryPercent"))
                object.batteryPercent = message.batteryPercent;
            if (message.signalStrength != null && message.hasOwnProperty("signalStrength"))
                object.signalStrength = message.signalStrength;
            if (message.queueDepth != null && message.hasOwnProperty("queueDepth"))
                object.queueDepth = message.queueDepth;
            return object;
        };

        /**
         * Converts this HeartbeatEvent to JSON.
         * @function toJSON
         * @memberof omnora.HeartbeatEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HeartbeatEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return HeartbeatEvent;
    })();

    omnora.SOSEvent = (function() {

        /**
         * Properties of a SOSEvent.
         * @memberof omnora
         * @interface ISOSEvent
         * @property {string|null} [nodeId] SOSEvent nodeId
         * @property {string|null} [workerId] SOSEvent workerId
         * @property {number|Long|null} [timestamp] SOSEvent timestamp
         * @property {string|null} [message] SOSEvent message
         * @property {string|null} [location] SOSEvent location
         */

        /**
         * Constructs a new SOSEvent.
         * @memberof omnora
         * @classdesc Represents a SOSEvent.
         * @implements ISOSEvent
         * @constructor
         * @param {omnora.ISOSEvent=} [properties] Properties to set
         */
        function SOSEvent(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SOSEvent nodeId.
         * @member {string} nodeId
         * @memberof omnora.SOSEvent
         * @instance
         */
        SOSEvent.prototype.nodeId = "";

        /**
         * SOSEvent workerId.
         * @member {string} workerId
         * @memberof omnora.SOSEvent
         * @instance
         */
        SOSEvent.prototype.workerId = "";

        /**
         * SOSEvent timestamp.
         * @member {number|Long} timestamp
         * @memberof omnora.SOSEvent
         * @instance
         */
        SOSEvent.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * SOSEvent message.
         * @member {string} message
         * @memberof omnora.SOSEvent
         * @instance
         */
        SOSEvent.prototype.message = "";

        /**
         * SOSEvent location.
         * @member {string} location
         * @memberof omnora.SOSEvent
         * @instance
         */
        SOSEvent.prototype.location = "";

        /**
         * Creates a new SOSEvent instance using the specified properties.
         * @function create
         * @memberof omnora.SOSEvent
         * @static
         * @param {omnora.ISOSEvent=} [properties] Properties to set
         * @returns {omnora.SOSEvent} SOSEvent instance
         */
        SOSEvent.create = function create(properties) {
            return new SOSEvent(properties);
        };

        /**
         * Encodes the specified SOSEvent message. Does not implicitly {@link omnora.SOSEvent.verify|verify} messages.
         * @function encode
         * @memberof omnora.SOSEvent
         * @static
         * @param {omnora.ISOSEvent} message SOSEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SOSEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nodeId != null && Object.hasOwnProperty.call(message, "nodeId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.nodeId);
            if (message.workerId != null && Object.hasOwnProperty.call(message, "workerId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.workerId);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.timestamp);
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.message);
            if (message.location != null && Object.hasOwnProperty.call(message, "location"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.location);
            return writer;
        };

        /**
         * Encodes the specified SOSEvent message, length delimited. Does not implicitly {@link omnora.SOSEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.SOSEvent
         * @static
         * @param {omnora.ISOSEvent} message SOSEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SOSEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SOSEvent message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.SOSEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.SOSEvent} SOSEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SOSEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.SOSEvent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nodeId = reader.string();
                    break;
                case 2:
                    message.workerId = reader.string();
                    break;
                case 3:
                    message.timestamp = reader.int64();
                    break;
                case 4:
                    message.message = reader.string();
                    break;
                case 5:
                    message.location = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SOSEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.SOSEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.SOSEvent} SOSEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SOSEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SOSEvent message.
         * @function verify
         * @memberof omnora.SOSEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SOSEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                if (!$util.isString(message.nodeId))
                    return "nodeId: string expected";
            if (message.workerId != null && message.hasOwnProperty("workerId"))
                if (!$util.isString(message.workerId))
                    return "workerId: string expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            if (message.location != null && message.hasOwnProperty("location"))
                if (!$util.isString(message.location))
                    return "location: string expected";
            return null;
        };

        /**
         * Creates a SOSEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.SOSEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.SOSEvent} SOSEvent
         */
        SOSEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.SOSEvent)
                return object;
            var message = new $root.omnora.SOSEvent();
            if (object.nodeId != null)
                message.nodeId = String(object.nodeId);
            if (object.workerId != null)
                message.workerId = String(object.workerId);
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            if (object.message != null)
                message.message = String(object.message);
            if (object.location != null)
                message.location = String(object.location);
            return message;
        };

        /**
         * Creates a plain object from a SOSEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.SOSEvent
         * @static
         * @param {omnora.SOSEvent} message SOSEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SOSEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.nodeId = "";
                object.workerId = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                object.message = "";
                object.location = "";
            }
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                object.nodeId = message.nodeId;
            if (message.workerId != null && message.hasOwnProperty("workerId"))
                object.workerId = message.workerId;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            if (message.location != null && message.hasOwnProperty("location"))
                object.location = message.location;
            return object;
        };

        /**
         * Converts this SOSEvent to JSON.
         * @function toJSON
         * @memberof omnora.SOSEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SOSEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SOSEvent;
    })();

    omnora.ErrorEvent = (function() {

        /**
         * Properties of an ErrorEvent.
         * @memberof omnora
         * @interface IErrorEvent
         * @property {string|null} [nodeId] ErrorEvent nodeId
         * @property {number|Long|null} [timestamp] ErrorEvent timestamp
         * @property {string|null} [errorCode] ErrorEvent errorCode
         * @property {string|null} [errorMessage] ErrorEvent errorMessage
         * @property {string|null} [context] ErrorEvent context
         */

        /**
         * Constructs a new ErrorEvent.
         * @memberof omnora
         * @classdesc Represents an ErrorEvent.
         * @implements IErrorEvent
         * @constructor
         * @param {omnora.IErrorEvent=} [properties] Properties to set
         */
        function ErrorEvent(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ErrorEvent nodeId.
         * @member {string} nodeId
         * @memberof omnora.ErrorEvent
         * @instance
         */
        ErrorEvent.prototype.nodeId = "";

        /**
         * ErrorEvent timestamp.
         * @member {number|Long} timestamp
         * @memberof omnora.ErrorEvent
         * @instance
         */
        ErrorEvent.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * ErrorEvent errorCode.
         * @member {string} errorCode
         * @memberof omnora.ErrorEvent
         * @instance
         */
        ErrorEvent.prototype.errorCode = "";

        /**
         * ErrorEvent errorMessage.
         * @member {string} errorMessage
         * @memberof omnora.ErrorEvent
         * @instance
         */
        ErrorEvent.prototype.errorMessage = "";

        /**
         * ErrorEvent context.
         * @member {string} context
         * @memberof omnora.ErrorEvent
         * @instance
         */
        ErrorEvent.prototype.context = "";

        /**
         * Creates a new ErrorEvent instance using the specified properties.
         * @function create
         * @memberof omnora.ErrorEvent
         * @static
         * @param {omnora.IErrorEvent=} [properties] Properties to set
         * @returns {omnora.ErrorEvent} ErrorEvent instance
         */
        ErrorEvent.create = function create(properties) {
            return new ErrorEvent(properties);
        };

        /**
         * Encodes the specified ErrorEvent message. Does not implicitly {@link omnora.ErrorEvent.verify|verify} messages.
         * @function encode
         * @memberof omnora.ErrorEvent
         * @static
         * @param {omnora.IErrorEvent} message ErrorEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ErrorEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nodeId != null && Object.hasOwnProperty.call(message, "nodeId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.nodeId);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.timestamp);
            if (message.errorCode != null && Object.hasOwnProperty.call(message, "errorCode"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.errorCode);
            if (message.errorMessage != null && Object.hasOwnProperty.call(message, "errorMessage"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.errorMessage);
            if (message.context != null && Object.hasOwnProperty.call(message, "context"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.context);
            return writer;
        };

        /**
         * Encodes the specified ErrorEvent message, length delimited. Does not implicitly {@link omnora.ErrorEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.ErrorEvent
         * @static
         * @param {omnora.IErrorEvent} message ErrorEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ErrorEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ErrorEvent message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.ErrorEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.ErrorEvent} ErrorEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ErrorEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.ErrorEvent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nodeId = reader.string();
                    break;
                case 2:
                    message.timestamp = reader.int64();
                    break;
                case 3:
                    message.errorCode = reader.string();
                    break;
                case 4:
                    message.errorMessage = reader.string();
                    break;
                case 5:
                    message.context = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ErrorEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.ErrorEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.ErrorEvent} ErrorEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ErrorEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ErrorEvent message.
         * @function verify
         * @memberof omnora.ErrorEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ErrorEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                if (!$util.isString(message.nodeId))
                    return "nodeId: string expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.errorCode != null && message.hasOwnProperty("errorCode"))
                if (!$util.isString(message.errorCode))
                    return "errorCode: string expected";
            if (message.errorMessage != null && message.hasOwnProperty("errorMessage"))
                if (!$util.isString(message.errorMessage))
                    return "errorMessage: string expected";
            if (message.context != null && message.hasOwnProperty("context"))
                if (!$util.isString(message.context))
                    return "context: string expected";
            return null;
        };

        /**
         * Creates an ErrorEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.ErrorEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.ErrorEvent} ErrorEvent
         */
        ErrorEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.ErrorEvent)
                return object;
            var message = new $root.omnora.ErrorEvent();
            if (object.nodeId != null)
                message.nodeId = String(object.nodeId);
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            if (object.errorCode != null)
                message.errorCode = String(object.errorCode);
            if (object.errorMessage != null)
                message.errorMessage = String(object.errorMessage);
            if (object.context != null)
                message.context = String(object.context);
            return message;
        };

        /**
         * Creates a plain object from an ErrorEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.ErrorEvent
         * @static
         * @param {omnora.ErrorEvent} message ErrorEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ErrorEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.nodeId = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                object.errorCode = "";
                object.errorMessage = "";
                object.context = "";
            }
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                object.nodeId = message.nodeId;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            if (message.errorCode != null && message.hasOwnProperty("errorCode"))
                object.errorCode = message.errorCode;
            if (message.errorMessage != null && message.hasOwnProperty("errorMessage"))
                object.errorMessage = message.errorMessage;
            if (message.context != null && message.hasOwnProperty("context"))
                object.context = message.context;
            return object;
        };

        /**
         * Converts this ErrorEvent to JSON.
         * @function toJSON
         * @memberof omnora.ErrorEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ErrorEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ErrorEvent;
    })();

    omnora.TelemetryEvent = (function() {

        /**
         * Properties of a TelemetryEvent.
         * @memberof omnora
         * @interface ITelemetryEvent
         * @property {string|null} [nodeId] TelemetryEvent nodeId
         * @property {number|Long|null} [timestamp] TelemetryEvent timestamp
         * @property {number|null} [batteryTemp] TelemetryEvent batteryTemp
         * @property {number|Long|null} [memUsage] TelemetryEvent memUsage
         * @property {number|null} [encLatencyMs] TelemetryEvent encLatencyMs
         * @property {number|null} [packetSizeBytes] TelemetryEvent packetSizeBytes
         */

        /**
         * Constructs a new TelemetryEvent.
         * @memberof omnora
         * @classdesc Represents a TelemetryEvent.
         * @implements ITelemetryEvent
         * @constructor
         * @param {omnora.ITelemetryEvent=} [properties] Properties to set
         */
        function TelemetryEvent(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TelemetryEvent nodeId.
         * @member {string} nodeId
         * @memberof omnora.TelemetryEvent
         * @instance
         */
        TelemetryEvent.prototype.nodeId = "";

        /**
         * TelemetryEvent timestamp.
         * @member {number|Long} timestamp
         * @memberof omnora.TelemetryEvent
         * @instance
         */
        TelemetryEvent.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * TelemetryEvent batteryTemp.
         * @member {number} batteryTemp
         * @memberof omnora.TelemetryEvent
         * @instance
         */
        TelemetryEvent.prototype.batteryTemp = 0;

        /**
         * TelemetryEvent memUsage.
         * @member {number|Long} memUsage
         * @memberof omnora.TelemetryEvent
         * @instance
         */
        TelemetryEvent.prototype.memUsage = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * TelemetryEvent encLatencyMs.
         * @member {number} encLatencyMs
         * @memberof omnora.TelemetryEvent
         * @instance
         */
        TelemetryEvent.prototype.encLatencyMs = 0;

        /**
         * TelemetryEvent packetSizeBytes.
         * @member {number} packetSizeBytes
         * @memberof omnora.TelemetryEvent
         * @instance
         */
        TelemetryEvent.prototype.packetSizeBytes = 0;

        /**
         * Creates a new TelemetryEvent instance using the specified properties.
         * @function create
         * @memberof omnora.TelemetryEvent
         * @static
         * @param {omnora.ITelemetryEvent=} [properties] Properties to set
         * @returns {omnora.TelemetryEvent} TelemetryEvent instance
         */
        TelemetryEvent.create = function create(properties) {
            return new TelemetryEvent(properties);
        };

        /**
         * Encodes the specified TelemetryEvent message. Does not implicitly {@link omnora.TelemetryEvent.verify|verify} messages.
         * @function encode
         * @memberof omnora.TelemetryEvent
         * @static
         * @param {omnora.ITelemetryEvent} message TelemetryEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TelemetryEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nodeId != null && Object.hasOwnProperty.call(message, "nodeId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.nodeId);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.timestamp);
            if (message.batteryTemp != null && Object.hasOwnProperty.call(message, "batteryTemp"))
                writer.uint32(/* id 3, wireType 5 =*/29).float(message.batteryTemp);
            if (message.memUsage != null && Object.hasOwnProperty.call(message, "memUsage"))
                writer.uint32(/* id 4, wireType 0 =*/32).int64(message.memUsage);
            if (message.encLatencyMs != null && Object.hasOwnProperty.call(message, "encLatencyMs"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.encLatencyMs);
            if (message.packetSizeBytes != null && Object.hasOwnProperty.call(message, "packetSizeBytes"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.packetSizeBytes);
            return writer;
        };

        /**
         * Encodes the specified TelemetryEvent message, length delimited. Does not implicitly {@link omnora.TelemetryEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.TelemetryEvent
         * @static
         * @param {omnora.ITelemetryEvent} message TelemetryEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TelemetryEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TelemetryEvent message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.TelemetryEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.TelemetryEvent} TelemetryEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TelemetryEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.TelemetryEvent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nodeId = reader.string();
                    break;
                case 2:
                    message.timestamp = reader.int64();
                    break;
                case 3:
                    message.batteryTemp = reader.float();
                    break;
                case 4:
                    message.memUsage = reader.int64();
                    break;
                case 5:
                    message.encLatencyMs = reader.int32();
                    break;
                case 6:
                    message.packetSizeBytes = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TelemetryEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.TelemetryEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.TelemetryEvent} TelemetryEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TelemetryEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TelemetryEvent message.
         * @function verify
         * @memberof omnora.TelemetryEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TelemetryEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                if (!$util.isString(message.nodeId))
                    return "nodeId: string expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.batteryTemp != null && message.hasOwnProperty("batteryTemp"))
                if (typeof message.batteryTemp !== "number")
                    return "batteryTemp: number expected";
            if (message.memUsage != null && message.hasOwnProperty("memUsage"))
                if (!$util.isInteger(message.memUsage) && !(message.memUsage && $util.isInteger(message.memUsage.low) && $util.isInteger(message.memUsage.high)))
                    return "memUsage: integer|Long expected";
            if (message.encLatencyMs != null && message.hasOwnProperty("encLatencyMs"))
                if (!$util.isInteger(message.encLatencyMs))
                    return "encLatencyMs: integer expected";
            if (message.packetSizeBytes != null && message.hasOwnProperty("packetSizeBytes"))
                if (!$util.isInteger(message.packetSizeBytes))
                    return "packetSizeBytes: integer expected";
            return null;
        };

        /**
         * Creates a TelemetryEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.TelemetryEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.TelemetryEvent} TelemetryEvent
         */
        TelemetryEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.TelemetryEvent)
                return object;
            var message = new $root.omnora.TelemetryEvent();
            if (object.nodeId != null)
                message.nodeId = String(object.nodeId);
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            if (object.batteryTemp != null)
                message.batteryTemp = Number(object.batteryTemp);
            if (object.memUsage != null)
                if ($util.Long)
                    (message.memUsage = $util.Long.fromValue(object.memUsage)).unsigned = false;
                else if (typeof object.memUsage === "string")
                    message.memUsage = parseInt(object.memUsage, 10);
                else if (typeof object.memUsage === "number")
                    message.memUsage = object.memUsage;
                else if (typeof object.memUsage === "object")
                    message.memUsage = new $util.LongBits(object.memUsage.low >>> 0, object.memUsage.high >>> 0).toNumber();
            if (object.encLatencyMs != null)
                message.encLatencyMs = object.encLatencyMs | 0;
            if (object.packetSizeBytes != null)
                message.packetSizeBytes = object.packetSizeBytes | 0;
            return message;
        };

        /**
         * Creates a plain object from a TelemetryEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.TelemetryEvent
         * @static
         * @param {omnora.TelemetryEvent} message TelemetryEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TelemetryEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.nodeId = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                object.batteryTemp = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.memUsage = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.memUsage = options.longs === String ? "0" : 0;
                object.encLatencyMs = 0;
                object.packetSizeBytes = 0;
            }
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                object.nodeId = message.nodeId;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            if (message.batteryTemp != null && message.hasOwnProperty("batteryTemp"))
                object.batteryTemp = options.json && !isFinite(message.batteryTemp) ? String(message.batteryTemp) : message.batteryTemp;
            if (message.memUsage != null && message.hasOwnProperty("memUsage"))
                if (typeof message.memUsage === "number")
                    object.memUsage = options.longs === String ? String(message.memUsage) : message.memUsage;
                else
                    object.memUsage = options.longs === String ? $util.Long.prototype.toString.call(message.memUsage) : options.longs === Number ? new $util.LongBits(message.memUsage.low >>> 0, message.memUsage.high >>> 0).toNumber() : message.memUsage;
            if (message.encLatencyMs != null && message.hasOwnProperty("encLatencyMs"))
                object.encLatencyMs = message.encLatencyMs;
            if (message.packetSizeBytes != null && message.hasOwnProperty("packetSizeBytes"))
                object.packetSizeBytes = message.packetSizeBytes;
            return object;
        };

        /**
         * Converts this TelemetryEvent to JSON.
         * @function toJSON
         * @memberof omnora.TelemetryEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TelemetryEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return TelemetryEvent;
    })();

    omnora.KhataEntry = (function() {

        /**
         * Properties of a KhataEntry.
         * @memberof omnora
         * @interface IKhataEntry
         * @property {string|null} [entryId] KhataEntry entryId
         * @property {string|null} [nodeId] KhataEntry nodeId
         * @property {string|null} [workerId] KhataEntry workerId
         * @property {string|null} [debitAccount] KhataEntry debitAccount
         * @property {string|null} [creditAccount] KhataEntry creditAccount
         * @property {number|Long|null} [amountPkr] KhataEntry amountPkr
         * @property {number|Long|null} [timestamp] KhataEntry timestamp
         * @property {string|null} [syncStatus] KhataEntry syncStatus
         */

        /**
         * Constructs a new KhataEntry.
         * @memberof omnora
         * @classdesc Represents a KhataEntry.
         * @implements IKhataEntry
         * @constructor
         * @param {omnora.IKhataEntry=} [properties] Properties to set
         */
        function KhataEntry(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * KhataEntry entryId.
         * @member {string} entryId
         * @memberof omnora.KhataEntry
         * @instance
         */
        KhataEntry.prototype.entryId = "";

        /**
         * KhataEntry nodeId.
         * @member {string} nodeId
         * @memberof omnora.KhataEntry
         * @instance
         */
        KhataEntry.prototype.nodeId = "";

        /**
         * KhataEntry workerId.
         * @member {string} workerId
         * @memberof omnora.KhataEntry
         * @instance
         */
        KhataEntry.prototype.workerId = "";

        /**
         * KhataEntry debitAccount.
         * @member {string} debitAccount
         * @memberof omnora.KhataEntry
         * @instance
         */
        KhataEntry.prototype.debitAccount = "";

        /**
         * KhataEntry creditAccount.
         * @member {string} creditAccount
         * @memberof omnora.KhataEntry
         * @instance
         */
        KhataEntry.prototype.creditAccount = "";

        /**
         * KhataEntry amountPkr.
         * @member {number|Long} amountPkr
         * @memberof omnora.KhataEntry
         * @instance
         */
        KhataEntry.prototype.amountPkr = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * KhataEntry timestamp.
         * @member {number|Long} timestamp
         * @memberof omnora.KhataEntry
         * @instance
         */
        KhataEntry.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * KhataEntry syncStatus.
         * @member {string} syncStatus
         * @memberof omnora.KhataEntry
         * @instance
         */
        KhataEntry.prototype.syncStatus = "";

        /**
         * Creates a new KhataEntry instance using the specified properties.
         * @function create
         * @memberof omnora.KhataEntry
         * @static
         * @param {omnora.IKhataEntry=} [properties] Properties to set
         * @returns {omnora.KhataEntry} KhataEntry instance
         */
        KhataEntry.create = function create(properties) {
            return new KhataEntry(properties);
        };

        /**
         * Encodes the specified KhataEntry message. Does not implicitly {@link omnora.KhataEntry.verify|verify} messages.
         * @function encode
         * @memberof omnora.KhataEntry
         * @static
         * @param {omnora.IKhataEntry} message KhataEntry message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        KhataEntry.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.entryId != null && Object.hasOwnProperty.call(message, "entryId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.entryId);
            if (message.nodeId != null && Object.hasOwnProperty.call(message, "nodeId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.nodeId);
            if (message.workerId != null && Object.hasOwnProperty.call(message, "workerId"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.workerId);
            if (message.debitAccount != null && Object.hasOwnProperty.call(message, "debitAccount"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.debitAccount);
            if (message.creditAccount != null && Object.hasOwnProperty.call(message, "creditAccount"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.creditAccount);
            if (message.amountPkr != null && Object.hasOwnProperty.call(message, "amountPkr"))
                writer.uint32(/* id 6, wireType 0 =*/48).int64(message.amountPkr);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 7, wireType 0 =*/56).int64(message.timestamp);
            if (message.syncStatus != null && Object.hasOwnProperty.call(message, "syncStatus"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.syncStatus);
            return writer;
        };

        /**
         * Encodes the specified KhataEntry message, length delimited. Does not implicitly {@link omnora.KhataEntry.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.KhataEntry
         * @static
         * @param {omnora.IKhataEntry} message KhataEntry message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        KhataEntry.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a KhataEntry message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.KhataEntry
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.KhataEntry} KhataEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        KhataEntry.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.KhataEntry();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.entryId = reader.string();
                    break;
                case 2:
                    message.nodeId = reader.string();
                    break;
                case 3:
                    message.workerId = reader.string();
                    break;
                case 4:
                    message.debitAccount = reader.string();
                    break;
                case 5:
                    message.creditAccount = reader.string();
                    break;
                case 6:
                    message.amountPkr = reader.int64();
                    break;
                case 7:
                    message.timestamp = reader.int64();
                    break;
                case 8:
                    message.syncStatus = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a KhataEntry message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.KhataEntry
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.KhataEntry} KhataEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        KhataEntry.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a KhataEntry message.
         * @function verify
         * @memberof omnora.KhataEntry
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        KhataEntry.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.entryId != null && message.hasOwnProperty("entryId"))
                if (!$util.isString(message.entryId))
                    return "entryId: string expected";
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                if (!$util.isString(message.nodeId))
                    return "nodeId: string expected";
            if (message.workerId != null && message.hasOwnProperty("workerId"))
                if (!$util.isString(message.workerId))
                    return "workerId: string expected";
            if (message.debitAccount != null && message.hasOwnProperty("debitAccount"))
                if (!$util.isString(message.debitAccount))
                    return "debitAccount: string expected";
            if (message.creditAccount != null && message.hasOwnProperty("creditAccount"))
                if (!$util.isString(message.creditAccount))
                    return "creditAccount: string expected";
            if (message.amountPkr != null && message.hasOwnProperty("amountPkr"))
                if (!$util.isInteger(message.amountPkr) && !(message.amountPkr && $util.isInteger(message.amountPkr.low) && $util.isInteger(message.amountPkr.high)))
                    return "amountPkr: integer|Long expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.syncStatus != null && message.hasOwnProperty("syncStatus"))
                if (!$util.isString(message.syncStatus))
                    return "syncStatus: string expected";
            return null;
        };

        /**
         * Creates a KhataEntry message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.KhataEntry
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.KhataEntry} KhataEntry
         */
        KhataEntry.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.KhataEntry)
                return object;
            var message = new $root.omnora.KhataEntry();
            if (object.entryId != null)
                message.entryId = String(object.entryId);
            if (object.nodeId != null)
                message.nodeId = String(object.nodeId);
            if (object.workerId != null)
                message.workerId = String(object.workerId);
            if (object.debitAccount != null)
                message.debitAccount = String(object.debitAccount);
            if (object.creditAccount != null)
                message.creditAccount = String(object.creditAccount);
            if (object.amountPkr != null)
                if ($util.Long)
                    (message.amountPkr = $util.Long.fromValue(object.amountPkr)).unsigned = false;
                else if (typeof object.amountPkr === "string")
                    message.amountPkr = parseInt(object.amountPkr, 10);
                else if (typeof object.amountPkr === "number")
                    message.amountPkr = object.amountPkr;
                else if (typeof object.amountPkr === "object")
                    message.amountPkr = new $util.LongBits(object.amountPkr.low >>> 0, object.amountPkr.high >>> 0).toNumber();
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            if (object.syncStatus != null)
                message.syncStatus = String(object.syncStatus);
            return message;
        };

        /**
         * Creates a plain object from a KhataEntry message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.KhataEntry
         * @static
         * @param {omnora.KhataEntry} message KhataEntry
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        KhataEntry.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.entryId = "";
                object.nodeId = "";
                object.workerId = "";
                object.debitAccount = "";
                object.creditAccount = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.amountPkr = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.amountPkr = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                object.syncStatus = "";
            }
            if (message.entryId != null && message.hasOwnProperty("entryId"))
                object.entryId = message.entryId;
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                object.nodeId = message.nodeId;
            if (message.workerId != null && message.hasOwnProperty("workerId"))
                object.workerId = message.workerId;
            if (message.debitAccount != null && message.hasOwnProperty("debitAccount"))
                object.debitAccount = message.debitAccount;
            if (message.creditAccount != null && message.hasOwnProperty("creditAccount"))
                object.creditAccount = message.creditAccount;
            if (message.amountPkr != null && message.hasOwnProperty("amountPkr"))
                if (typeof message.amountPkr === "number")
                    object.amountPkr = options.longs === String ? String(message.amountPkr) : message.amountPkr;
                else
                    object.amountPkr = options.longs === String ? $util.Long.prototype.toString.call(message.amountPkr) : options.longs === Number ? new $util.LongBits(message.amountPkr.low >>> 0, message.amountPkr.high >>> 0).toNumber() : message.amountPkr;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            if (message.syncStatus != null && message.hasOwnProperty("syncStatus"))
                object.syncStatus = message.syncStatus;
            return object;
        };

        /**
         * Converts this KhataEntry to JSON.
         * @function toJSON
         * @memberof omnora.KhataEntry
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        KhataEntry.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return KhataEntry;
    })();

    omnora.StockDelta = (function() {

        /**
         * Properties of a StockDelta.
         * @memberof omnora
         * @interface IStockDelta
         * @property {string|null} [deltaId] StockDelta deltaId
         * @property {string|null} [nodeId] StockDelta nodeId
         * @property {string|null} [operationType] StockDelta operationType
         * @property {string|null} [batchId] StockDelta batchId
         * @property {number|null} [qty] StockDelta qty
         * @property {number|Long|null} [timestamp] StockDelta timestamp
         * @property {string|null} [vectorClock] StockDelta vectorClock
         */

        /**
         * Constructs a new StockDelta.
         * @memberof omnora
         * @classdesc Represents a StockDelta.
         * @implements IStockDelta
         * @constructor
         * @param {omnora.IStockDelta=} [properties] Properties to set
         */
        function StockDelta(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * StockDelta deltaId.
         * @member {string} deltaId
         * @memberof omnora.StockDelta
         * @instance
         */
        StockDelta.prototype.deltaId = "";

        /**
         * StockDelta nodeId.
         * @member {string} nodeId
         * @memberof omnora.StockDelta
         * @instance
         */
        StockDelta.prototype.nodeId = "";

        /**
         * StockDelta operationType.
         * @member {string} operationType
         * @memberof omnora.StockDelta
         * @instance
         */
        StockDelta.prototype.operationType = "";

        /**
         * StockDelta batchId.
         * @member {string} batchId
         * @memberof omnora.StockDelta
         * @instance
         */
        StockDelta.prototype.batchId = "";

        /**
         * StockDelta qty.
         * @member {number} qty
         * @memberof omnora.StockDelta
         * @instance
         */
        StockDelta.prototype.qty = 0;

        /**
         * StockDelta timestamp.
         * @member {number|Long} timestamp
         * @memberof omnora.StockDelta
         * @instance
         */
        StockDelta.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * StockDelta vectorClock.
         * @member {string} vectorClock
         * @memberof omnora.StockDelta
         * @instance
         */
        StockDelta.prototype.vectorClock = "";

        /**
         * Creates a new StockDelta instance using the specified properties.
         * @function create
         * @memberof omnora.StockDelta
         * @static
         * @param {omnora.IStockDelta=} [properties] Properties to set
         * @returns {omnora.StockDelta} StockDelta instance
         */
        StockDelta.create = function create(properties) {
            return new StockDelta(properties);
        };

        /**
         * Encodes the specified StockDelta message. Does not implicitly {@link omnora.StockDelta.verify|verify} messages.
         * @function encode
         * @memberof omnora.StockDelta
         * @static
         * @param {omnora.IStockDelta} message StockDelta message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StockDelta.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.deltaId != null && Object.hasOwnProperty.call(message, "deltaId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.deltaId);
            if (message.nodeId != null && Object.hasOwnProperty.call(message, "nodeId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.nodeId);
            if (message.operationType != null && Object.hasOwnProperty.call(message, "operationType"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.operationType);
            if (message.batchId != null && Object.hasOwnProperty.call(message, "batchId"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.batchId);
            if (message.qty != null && Object.hasOwnProperty.call(message, "qty"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.qty);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 6, wireType 0 =*/48).int64(message.timestamp);
            if (message.vectorClock != null && Object.hasOwnProperty.call(message, "vectorClock"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.vectorClock);
            return writer;
        };

        /**
         * Encodes the specified StockDelta message, length delimited. Does not implicitly {@link omnora.StockDelta.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.StockDelta
         * @static
         * @param {omnora.IStockDelta} message StockDelta message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StockDelta.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a StockDelta message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.StockDelta
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.StockDelta} StockDelta
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StockDelta.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.StockDelta();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.deltaId = reader.string();
                    break;
                case 2:
                    message.nodeId = reader.string();
                    break;
                case 3:
                    message.operationType = reader.string();
                    break;
                case 4:
                    message.batchId = reader.string();
                    break;
                case 5:
                    message.qty = reader.int32();
                    break;
                case 6:
                    message.timestamp = reader.int64();
                    break;
                case 7:
                    message.vectorClock = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a StockDelta message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.StockDelta
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.StockDelta} StockDelta
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StockDelta.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a StockDelta message.
         * @function verify
         * @memberof omnora.StockDelta
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        StockDelta.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.deltaId != null && message.hasOwnProperty("deltaId"))
                if (!$util.isString(message.deltaId))
                    return "deltaId: string expected";
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                if (!$util.isString(message.nodeId))
                    return "nodeId: string expected";
            if (message.operationType != null && message.hasOwnProperty("operationType"))
                if (!$util.isString(message.operationType))
                    return "operationType: string expected";
            if (message.batchId != null && message.hasOwnProperty("batchId"))
                if (!$util.isString(message.batchId))
                    return "batchId: string expected";
            if (message.qty != null && message.hasOwnProperty("qty"))
                if (!$util.isInteger(message.qty))
                    return "qty: integer expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.vectorClock != null && message.hasOwnProperty("vectorClock"))
                if (!$util.isString(message.vectorClock))
                    return "vectorClock: string expected";
            return null;
        };

        /**
         * Creates a StockDelta message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.StockDelta
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.StockDelta} StockDelta
         */
        StockDelta.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.StockDelta)
                return object;
            var message = new $root.omnora.StockDelta();
            if (object.deltaId != null)
                message.deltaId = String(object.deltaId);
            if (object.nodeId != null)
                message.nodeId = String(object.nodeId);
            if (object.operationType != null)
                message.operationType = String(object.operationType);
            if (object.batchId != null)
                message.batchId = String(object.batchId);
            if (object.qty != null)
                message.qty = object.qty | 0;
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            if (object.vectorClock != null)
                message.vectorClock = String(object.vectorClock);
            return message;
        };

        /**
         * Creates a plain object from a StockDelta message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.StockDelta
         * @static
         * @param {omnora.StockDelta} message StockDelta
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        StockDelta.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.deltaId = "";
                object.nodeId = "";
                object.operationType = "";
                object.batchId = "";
                object.qty = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                object.vectorClock = "";
            }
            if (message.deltaId != null && message.hasOwnProperty("deltaId"))
                object.deltaId = message.deltaId;
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                object.nodeId = message.nodeId;
            if (message.operationType != null && message.hasOwnProperty("operationType"))
                object.operationType = message.operationType;
            if (message.batchId != null && message.hasOwnProperty("batchId"))
                object.batchId = message.batchId;
            if (message.qty != null && message.hasOwnProperty("qty"))
                object.qty = message.qty;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            if (message.vectorClock != null && message.hasOwnProperty("vectorClock"))
                object.vectorClock = message.vectorClock;
            return object;
        };

        /**
         * Converts this StockDelta to JSON.
         * @function toJSON
         * @memberof omnora.StockDelta
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        StockDelta.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return StockDelta;
    })();

    omnora.TacticalMessage = (function() {

        /**
         * Properties of a TacticalMessage.
         * @memberof omnora
         * @interface ITacticalMessage
         * @property {string|null} [messageId] TacticalMessage messageId
         * @property {string|null} [fromNodeId] TacticalMessage fromNodeId
         * @property {string|null} [toNodeId] TacticalMessage toNodeId
         * @property {string|null} [content] TacticalMessage content
         * @property {string|null} [mediaType] TacticalMessage mediaType
         * @property {number|Long|null} [timestamp] TacticalMessage timestamp
         * @property {boolean|null} [isEncrypted] TacticalMessage isEncrypted
         * @property {Uint8Array|null} [encryptedPayload] TacticalMessage encryptedPayload
         */

        /**
         * Constructs a new TacticalMessage.
         * @memberof omnora
         * @classdesc Represents a TacticalMessage.
         * @implements ITacticalMessage
         * @constructor
         * @param {omnora.ITacticalMessage=} [properties] Properties to set
         */
        function TacticalMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TacticalMessage messageId.
         * @member {string} messageId
         * @memberof omnora.TacticalMessage
         * @instance
         */
        TacticalMessage.prototype.messageId = "";

        /**
         * TacticalMessage fromNodeId.
         * @member {string} fromNodeId
         * @memberof omnora.TacticalMessage
         * @instance
         */
        TacticalMessage.prototype.fromNodeId = "";

        /**
         * TacticalMessage toNodeId.
         * @member {string} toNodeId
         * @memberof omnora.TacticalMessage
         * @instance
         */
        TacticalMessage.prototype.toNodeId = "";

        /**
         * TacticalMessage content.
         * @member {string} content
         * @memberof omnora.TacticalMessage
         * @instance
         */
        TacticalMessage.prototype.content = "";

        /**
         * TacticalMessage mediaType.
         * @member {string} mediaType
         * @memberof omnora.TacticalMessage
         * @instance
         */
        TacticalMessage.prototype.mediaType = "";

        /**
         * TacticalMessage timestamp.
         * @member {number|Long} timestamp
         * @memberof omnora.TacticalMessage
         * @instance
         */
        TacticalMessage.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * TacticalMessage isEncrypted.
         * @member {boolean} isEncrypted
         * @memberof omnora.TacticalMessage
         * @instance
         */
        TacticalMessage.prototype.isEncrypted = false;

        /**
         * TacticalMessage encryptedPayload.
         * @member {Uint8Array} encryptedPayload
         * @memberof omnora.TacticalMessage
         * @instance
         */
        TacticalMessage.prototype.encryptedPayload = $util.newBuffer([]);

        /**
         * Creates a new TacticalMessage instance using the specified properties.
         * @function create
         * @memberof omnora.TacticalMessage
         * @static
         * @param {omnora.ITacticalMessage=} [properties] Properties to set
         * @returns {omnora.TacticalMessage} TacticalMessage instance
         */
        TacticalMessage.create = function create(properties) {
            return new TacticalMessage(properties);
        };

        /**
         * Encodes the specified TacticalMessage message. Does not implicitly {@link omnora.TacticalMessage.verify|verify} messages.
         * @function encode
         * @memberof omnora.TacticalMessage
         * @static
         * @param {omnora.ITacticalMessage} message TacticalMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TacticalMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.messageId != null && Object.hasOwnProperty.call(message, "messageId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.messageId);
            if (message.fromNodeId != null && Object.hasOwnProperty.call(message, "fromNodeId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.fromNodeId);
            if (message.toNodeId != null && Object.hasOwnProperty.call(message, "toNodeId"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.toNodeId);
            if (message.content != null && Object.hasOwnProperty.call(message, "content"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.content);
            if (message.mediaType != null && Object.hasOwnProperty.call(message, "mediaType"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.mediaType);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 6, wireType 0 =*/48).int64(message.timestamp);
            if (message.isEncrypted != null && Object.hasOwnProperty.call(message, "isEncrypted"))
                writer.uint32(/* id 7, wireType 0 =*/56).bool(message.isEncrypted);
            if (message.encryptedPayload != null && Object.hasOwnProperty.call(message, "encryptedPayload"))
                writer.uint32(/* id 8, wireType 2 =*/66).bytes(message.encryptedPayload);
            return writer;
        };

        /**
         * Encodes the specified TacticalMessage message, length delimited. Does not implicitly {@link omnora.TacticalMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.TacticalMessage
         * @static
         * @param {omnora.ITacticalMessage} message TacticalMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TacticalMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TacticalMessage message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.TacticalMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.TacticalMessage} TacticalMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TacticalMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.TacticalMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.messageId = reader.string();
                    break;
                case 2:
                    message.fromNodeId = reader.string();
                    break;
                case 3:
                    message.toNodeId = reader.string();
                    break;
                case 4:
                    message.content = reader.string();
                    break;
                case 5:
                    message.mediaType = reader.string();
                    break;
                case 6:
                    message.timestamp = reader.int64();
                    break;
                case 7:
                    message.isEncrypted = reader.bool();
                    break;
                case 8:
                    message.encryptedPayload = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TacticalMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.TacticalMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.TacticalMessage} TacticalMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TacticalMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TacticalMessage message.
         * @function verify
         * @memberof omnora.TacticalMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TacticalMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.messageId != null && message.hasOwnProperty("messageId"))
                if (!$util.isString(message.messageId))
                    return "messageId: string expected";
            if (message.fromNodeId != null && message.hasOwnProperty("fromNodeId"))
                if (!$util.isString(message.fromNodeId))
                    return "fromNodeId: string expected";
            if (message.toNodeId != null && message.hasOwnProperty("toNodeId"))
                if (!$util.isString(message.toNodeId))
                    return "toNodeId: string expected";
            if (message.content != null && message.hasOwnProperty("content"))
                if (!$util.isString(message.content))
                    return "content: string expected";
            if (message.mediaType != null && message.hasOwnProperty("mediaType"))
                if (!$util.isString(message.mediaType))
                    return "mediaType: string expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.isEncrypted != null && message.hasOwnProperty("isEncrypted"))
                if (typeof message.isEncrypted !== "boolean")
                    return "isEncrypted: boolean expected";
            if (message.encryptedPayload != null && message.hasOwnProperty("encryptedPayload"))
                if (!(message.encryptedPayload && typeof message.encryptedPayload.length === "number" || $util.isString(message.encryptedPayload)))
                    return "encryptedPayload: buffer expected";
            return null;
        };

        /**
         * Creates a TacticalMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.TacticalMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.TacticalMessage} TacticalMessage
         */
        TacticalMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.TacticalMessage)
                return object;
            var message = new $root.omnora.TacticalMessage();
            if (object.messageId != null)
                message.messageId = String(object.messageId);
            if (object.fromNodeId != null)
                message.fromNodeId = String(object.fromNodeId);
            if (object.toNodeId != null)
                message.toNodeId = String(object.toNodeId);
            if (object.content != null)
                message.content = String(object.content);
            if (object.mediaType != null)
                message.mediaType = String(object.mediaType);
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            if (object.isEncrypted != null)
                message.isEncrypted = Boolean(object.isEncrypted);
            if (object.encryptedPayload != null)
                if (typeof object.encryptedPayload === "string")
                    $util.base64.decode(object.encryptedPayload, message.encryptedPayload = $util.newBuffer($util.base64.length(object.encryptedPayload)), 0);
                else if (object.encryptedPayload.length)
                    message.encryptedPayload = object.encryptedPayload;
            return message;
        };

        /**
         * Creates a plain object from a TacticalMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.TacticalMessage
         * @static
         * @param {omnora.TacticalMessage} message TacticalMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TacticalMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.messageId = "";
                object.fromNodeId = "";
                object.toNodeId = "";
                object.content = "";
                object.mediaType = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                object.isEncrypted = false;
                if (options.bytes === String)
                    object.encryptedPayload = "";
                else {
                    object.encryptedPayload = [];
                    if (options.bytes !== Array)
                        object.encryptedPayload = $util.newBuffer(object.encryptedPayload);
                }
            }
            if (message.messageId != null && message.hasOwnProperty("messageId"))
                object.messageId = message.messageId;
            if (message.fromNodeId != null && message.hasOwnProperty("fromNodeId"))
                object.fromNodeId = message.fromNodeId;
            if (message.toNodeId != null && message.hasOwnProperty("toNodeId"))
                object.toNodeId = message.toNodeId;
            if (message.content != null && message.hasOwnProperty("content"))
                object.content = message.content;
            if (message.mediaType != null && message.hasOwnProperty("mediaType"))
                object.mediaType = message.mediaType;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            if (message.isEncrypted != null && message.hasOwnProperty("isEncrypted"))
                object.isEncrypted = message.isEncrypted;
            if (message.encryptedPayload != null && message.hasOwnProperty("encryptedPayload"))
                object.encryptedPayload = options.bytes === String ? $util.base64.encode(message.encryptedPayload, 0, message.encryptedPayload.length) : options.bytes === Array ? Array.prototype.slice.call(message.encryptedPayload) : message.encryptedPayload;
            return object;
        };

        /**
         * Converts this TacticalMessage to JSON.
         * @function toJSON
         * @memberof omnora.TacticalMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TacticalMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return TacticalMessage;
    })();

    omnora.TypingEvent = (function() {

        /**
         * Properties of a TypingEvent.
         * @memberof omnora
         * @interface ITypingEvent
         * @property {string|null} [fromNodeId] TypingEvent fromNodeId
         * @property {string|null} [toNodeId] TypingEvent toNodeId
         * @property {number|Long|null} [timestamp] TypingEvent timestamp
         */

        /**
         * Constructs a new TypingEvent.
         * @memberof omnora
         * @classdesc Represents a TypingEvent.
         * @implements ITypingEvent
         * @constructor
         * @param {omnora.ITypingEvent=} [properties] Properties to set
         */
        function TypingEvent(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TypingEvent fromNodeId.
         * @member {string} fromNodeId
         * @memberof omnora.TypingEvent
         * @instance
         */
        TypingEvent.prototype.fromNodeId = "";

        /**
         * TypingEvent toNodeId.
         * @member {string} toNodeId
         * @memberof omnora.TypingEvent
         * @instance
         */
        TypingEvent.prototype.toNodeId = "";

        /**
         * TypingEvent timestamp.
         * @member {number|Long} timestamp
         * @memberof omnora.TypingEvent
         * @instance
         */
        TypingEvent.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new TypingEvent instance using the specified properties.
         * @function create
         * @memberof omnora.TypingEvent
         * @static
         * @param {omnora.ITypingEvent=} [properties] Properties to set
         * @returns {omnora.TypingEvent} TypingEvent instance
         */
        TypingEvent.create = function create(properties) {
            return new TypingEvent(properties);
        };

        /**
         * Encodes the specified TypingEvent message. Does not implicitly {@link omnora.TypingEvent.verify|verify} messages.
         * @function encode
         * @memberof omnora.TypingEvent
         * @static
         * @param {omnora.ITypingEvent} message TypingEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TypingEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.fromNodeId != null && Object.hasOwnProperty.call(message, "fromNodeId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.fromNodeId);
            if (message.toNodeId != null && Object.hasOwnProperty.call(message, "toNodeId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.toNodeId);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.timestamp);
            return writer;
        };

        /**
         * Encodes the specified TypingEvent message, length delimited. Does not implicitly {@link omnora.TypingEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.TypingEvent
         * @static
         * @param {omnora.ITypingEvent} message TypingEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TypingEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TypingEvent message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.TypingEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.TypingEvent} TypingEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TypingEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.TypingEvent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.fromNodeId = reader.string();
                    break;
                case 2:
                    message.toNodeId = reader.string();
                    break;
                case 3:
                    message.timestamp = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TypingEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.TypingEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.TypingEvent} TypingEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TypingEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TypingEvent message.
         * @function verify
         * @memberof omnora.TypingEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TypingEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.fromNodeId != null && message.hasOwnProperty("fromNodeId"))
                if (!$util.isString(message.fromNodeId))
                    return "fromNodeId: string expected";
            if (message.toNodeId != null && message.hasOwnProperty("toNodeId"))
                if (!$util.isString(message.toNodeId))
                    return "toNodeId: string expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            return null;
        };

        /**
         * Creates a TypingEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.TypingEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.TypingEvent} TypingEvent
         */
        TypingEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.TypingEvent)
                return object;
            var message = new $root.omnora.TypingEvent();
            if (object.fromNodeId != null)
                message.fromNodeId = String(object.fromNodeId);
            if (object.toNodeId != null)
                message.toNodeId = String(object.toNodeId);
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a TypingEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.TypingEvent
         * @static
         * @param {omnora.TypingEvent} message TypingEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TypingEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.fromNodeId = "";
                object.toNodeId = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
            }
            if (message.fromNodeId != null && message.hasOwnProperty("fromNodeId"))
                object.fromNodeId = message.fromNodeId;
            if (message.toNodeId != null && message.hasOwnProperty("toNodeId"))
                object.toNodeId = message.toNodeId;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            return object;
        };

        /**
         * Converts this TypingEvent to JSON.
         * @function toJSON
         * @memberof omnora.TypingEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TypingEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return TypingEvent;
    })();

    omnora.HubAck = (function() {

        /**
         * Properties of a HubAck.
         * @memberof omnora
         * @interface IHubAck
         * @property {string|null} [packetId] HubAck packetId
         * @property {string|null} [status] HubAck status
         * @property {number|null} [syncOffsetMs] HubAck syncOffsetMs
         * @property {number|Long|null} [timestamp] HubAck timestamp
         * @property {string|null} [activeProfile] HubAck activeProfile
         */

        /**
         * Constructs a new HubAck.
         * @memberof omnora
         * @classdesc Represents a HubAck.
         * @implements IHubAck
         * @constructor
         * @param {omnora.IHubAck=} [properties] Properties to set
         */
        function HubAck(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HubAck packetId.
         * @member {string} packetId
         * @memberof omnora.HubAck
         * @instance
         */
        HubAck.prototype.packetId = "";

        /**
         * HubAck status.
         * @member {string} status
         * @memberof omnora.HubAck
         * @instance
         */
        HubAck.prototype.status = "";

        /**
         * HubAck syncOffsetMs.
         * @member {number} syncOffsetMs
         * @memberof omnora.HubAck
         * @instance
         */
        HubAck.prototype.syncOffsetMs = 0;

        /**
         * HubAck timestamp.
         * @member {number|Long} timestamp
         * @memberof omnora.HubAck
         * @instance
         */
        HubAck.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * HubAck activeProfile.
         * @member {string} activeProfile
         * @memberof omnora.HubAck
         * @instance
         */
        HubAck.prototype.activeProfile = "";

        /**
         * Creates a new HubAck instance using the specified properties.
         * @function create
         * @memberof omnora.HubAck
         * @static
         * @param {omnora.IHubAck=} [properties] Properties to set
         * @returns {omnora.HubAck} HubAck instance
         */
        HubAck.create = function create(properties) {
            return new HubAck(properties);
        };

        /**
         * Encodes the specified HubAck message. Does not implicitly {@link omnora.HubAck.verify|verify} messages.
         * @function encode
         * @memberof omnora.HubAck
         * @static
         * @param {omnora.IHubAck} message HubAck message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HubAck.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.packetId != null && Object.hasOwnProperty.call(message, "packetId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.packetId);
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.status);
            if (message.syncOffsetMs != null && Object.hasOwnProperty.call(message, "syncOffsetMs"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.syncOffsetMs);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 4, wireType 0 =*/32).int64(message.timestamp);
            if (message.activeProfile != null && Object.hasOwnProperty.call(message, "activeProfile"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.activeProfile);
            return writer;
        };

        /**
         * Encodes the specified HubAck message, length delimited. Does not implicitly {@link omnora.HubAck.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.HubAck
         * @static
         * @param {omnora.IHubAck} message HubAck message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HubAck.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HubAck message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.HubAck
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.HubAck} HubAck
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HubAck.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.HubAck();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.packetId = reader.string();
                    break;
                case 2:
                    message.status = reader.string();
                    break;
                case 3:
                    message.syncOffsetMs = reader.int32();
                    break;
                case 4:
                    message.timestamp = reader.int64();
                    break;
                case 5:
                    message.activeProfile = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a HubAck message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.HubAck
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.HubAck} HubAck
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HubAck.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HubAck message.
         * @function verify
         * @memberof omnora.HubAck
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HubAck.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.packetId != null && message.hasOwnProperty("packetId"))
                if (!$util.isString(message.packetId))
                    return "packetId: string expected";
            if (message.status != null && message.hasOwnProperty("status"))
                if (!$util.isString(message.status))
                    return "status: string expected";
            if (message.syncOffsetMs != null && message.hasOwnProperty("syncOffsetMs"))
                if (!$util.isInteger(message.syncOffsetMs))
                    return "syncOffsetMs: integer expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.activeProfile != null && message.hasOwnProperty("activeProfile"))
                if (!$util.isString(message.activeProfile))
                    return "activeProfile: string expected";
            return null;
        };

        /**
         * Creates a HubAck message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.HubAck
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.HubAck} HubAck
         */
        HubAck.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.HubAck)
                return object;
            var message = new $root.omnora.HubAck();
            if (object.packetId != null)
                message.packetId = String(object.packetId);
            if (object.status != null)
                message.status = String(object.status);
            if (object.syncOffsetMs != null)
                message.syncOffsetMs = object.syncOffsetMs | 0;
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            if (object.activeProfile != null)
                message.activeProfile = String(object.activeProfile);
            return message;
        };

        /**
         * Creates a plain object from a HubAck message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.HubAck
         * @static
         * @param {omnora.HubAck} message HubAck
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HubAck.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.packetId = "";
                object.status = "";
                object.syncOffsetMs = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                object.activeProfile = "";
            }
            if (message.packetId != null && message.hasOwnProperty("packetId"))
                object.packetId = message.packetId;
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = message.status;
            if (message.syncOffsetMs != null && message.hasOwnProperty("syncOffsetMs"))
                object.syncOffsetMs = message.syncOffsetMs;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            if (message.activeProfile != null && message.hasOwnProperty("activeProfile"))
                object.activeProfile = message.activeProfile;
            return object;
        };

        /**
         * Converts this HubAck to JSON.
         * @function toJSON
         * @memberof omnora.HubAck
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HubAck.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return HubAck;
    })();

    omnora.FetchPendingMessagesRequest = (function() {

        /**
         * Properties of a FetchPendingMessagesRequest.
         * @memberof omnora
         * @interface IFetchPendingMessagesRequest
         * @property {string|null} [nodeId] FetchPendingMessagesRequest nodeId
         * @property {number|Long|null} [lastReceivedAt] FetchPendingMessagesRequest lastReceivedAt
         */

        /**
         * Constructs a new FetchPendingMessagesRequest.
         * @memberof omnora
         * @classdesc Represents a FetchPendingMessagesRequest.
         * @implements IFetchPendingMessagesRequest
         * @constructor
         * @param {omnora.IFetchPendingMessagesRequest=} [properties] Properties to set
         */
        function FetchPendingMessagesRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FetchPendingMessagesRequest nodeId.
         * @member {string} nodeId
         * @memberof omnora.FetchPendingMessagesRequest
         * @instance
         */
        FetchPendingMessagesRequest.prototype.nodeId = "";

        /**
         * FetchPendingMessagesRequest lastReceivedAt.
         * @member {number|Long} lastReceivedAt
         * @memberof omnora.FetchPendingMessagesRequest
         * @instance
         */
        FetchPendingMessagesRequest.prototype.lastReceivedAt = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new FetchPendingMessagesRequest instance using the specified properties.
         * @function create
         * @memberof omnora.FetchPendingMessagesRequest
         * @static
         * @param {omnora.IFetchPendingMessagesRequest=} [properties] Properties to set
         * @returns {omnora.FetchPendingMessagesRequest} FetchPendingMessagesRequest instance
         */
        FetchPendingMessagesRequest.create = function create(properties) {
            return new FetchPendingMessagesRequest(properties);
        };

        /**
         * Encodes the specified FetchPendingMessagesRequest message. Does not implicitly {@link omnora.FetchPendingMessagesRequest.verify|verify} messages.
         * @function encode
         * @memberof omnora.FetchPendingMessagesRequest
         * @static
         * @param {omnora.IFetchPendingMessagesRequest} message FetchPendingMessagesRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FetchPendingMessagesRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nodeId != null && Object.hasOwnProperty.call(message, "nodeId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.nodeId);
            if (message.lastReceivedAt != null && Object.hasOwnProperty.call(message, "lastReceivedAt"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.lastReceivedAt);
            return writer;
        };

        /**
         * Encodes the specified FetchPendingMessagesRequest message, length delimited. Does not implicitly {@link omnora.FetchPendingMessagesRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.FetchPendingMessagesRequest
         * @static
         * @param {omnora.IFetchPendingMessagesRequest} message FetchPendingMessagesRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FetchPendingMessagesRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FetchPendingMessagesRequest message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.FetchPendingMessagesRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.FetchPendingMessagesRequest} FetchPendingMessagesRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FetchPendingMessagesRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.FetchPendingMessagesRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nodeId = reader.string();
                    break;
                case 2:
                    message.lastReceivedAt = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FetchPendingMessagesRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.FetchPendingMessagesRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.FetchPendingMessagesRequest} FetchPendingMessagesRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FetchPendingMessagesRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FetchPendingMessagesRequest message.
         * @function verify
         * @memberof omnora.FetchPendingMessagesRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FetchPendingMessagesRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                if (!$util.isString(message.nodeId))
                    return "nodeId: string expected";
            if (message.lastReceivedAt != null && message.hasOwnProperty("lastReceivedAt"))
                if (!$util.isInteger(message.lastReceivedAt) && !(message.lastReceivedAt && $util.isInteger(message.lastReceivedAt.low) && $util.isInteger(message.lastReceivedAt.high)))
                    return "lastReceivedAt: integer|Long expected";
            return null;
        };

        /**
         * Creates a FetchPendingMessagesRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.FetchPendingMessagesRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.FetchPendingMessagesRequest} FetchPendingMessagesRequest
         */
        FetchPendingMessagesRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.FetchPendingMessagesRequest)
                return object;
            var message = new $root.omnora.FetchPendingMessagesRequest();
            if (object.nodeId != null)
                message.nodeId = String(object.nodeId);
            if (object.lastReceivedAt != null)
                if ($util.Long)
                    (message.lastReceivedAt = $util.Long.fromValue(object.lastReceivedAt)).unsigned = false;
                else if (typeof object.lastReceivedAt === "string")
                    message.lastReceivedAt = parseInt(object.lastReceivedAt, 10);
                else if (typeof object.lastReceivedAt === "number")
                    message.lastReceivedAt = object.lastReceivedAt;
                else if (typeof object.lastReceivedAt === "object")
                    message.lastReceivedAt = new $util.LongBits(object.lastReceivedAt.low >>> 0, object.lastReceivedAt.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a FetchPendingMessagesRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.FetchPendingMessagesRequest
         * @static
         * @param {omnora.FetchPendingMessagesRequest} message FetchPendingMessagesRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FetchPendingMessagesRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.nodeId = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.lastReceivedAt = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.lastReceivedAt = options.longs === String ? "0" : 0;
            }
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                object.nodeId = message.nodeId;
            if (message.lastReceivedAt != null && message.hasOwnProperty("lastReceivedAt"))
                if (typeof message.lastReceivedAt === "number")
                    object.lastReceivedAt = options.longs === String ? String(message.lastReceivedAt) : message.lastReceivedAt;
                else
                    object.lastReceivedAt = options.longs === String ? $util.Long.prototype.toString.call(message.lastReceivedAt) : options.longs === Number ? new $util.LongBits(message.lastReceivedAt.low >>> 0, message.lastReceivedAt.high >>> 0).toNumber() : message.lastReceivedAt;
            return object;
        };

        /**
         * Converts this FetchPendingMessagesRequest to JSON.
         * @function toJSON
         * @memberof omnora.FetchPendingMessagesRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FetchPendingMessagesRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return FetchPendingMessagesRequest;
    })();

    omnora.ProfileManifest = (function() {

        /**
         * Properties of a ProfileManifest.
         * @memberof omnora
         * @interface IProfileManifest
         * @property {string|null} [activeProfile] ProfileManifest activeProfile
         * @property {Array.<string>|null} [visibleModules] ProfileManifest visibleModules
         * @property {Object.<string,string>|null} [labelOverrides] ProfileManifest labelOverrides
         */

        /**
         * Constructs a new ProfileManifest.
         * @memberof omnora
         * @classdesc Represents a ProfileManifest.
         * @implements IProfileManifest
         * @constructor
         * @param {omnora.IProfileManifest=} [properties] Properties to set
         */
        function ProfileManifest(properties) {
            this.visibleModules = [];
            this.labelOverrides = {};
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ProfileManifest activeProfile.
         * @member {string} activeProfile
         * @memberof omnora.ProfileManifest
         * @instance
         */
        ProfileManifest.prototype.activeProfile = "";

        /**
         * ProfileManifest visibleModules.
         * @member {Array.<string>} visibleModules
         * @memberof omnora.ProfileManifest
         * @instance
         */
        ProfileManifest.prototype.visibleModules = $util.emptyArray;

        /**
         * ProfileManifest labelOverrides.
         * @member {Object.<string,string>} labelOverrides
         * @memberof omnora.ProfileManifest
         * @instance
         */
        ProfileManifest.prototype.labelOverrides = $util.emptyObject;

        /**
         * Creates a new ProfileManifest instance using the specified properties.
         * @function create
         * @memberof omnora.ProfileManifest
         * @static
         * @param {omnora.IProfileManifest=} [properties] Properties to set
         * @returns {omnora.ProfileManifest} ProfileManifest instance
         */
        ProfileManifest.create = function create(properties) {
            return new ProfileManifest(properties);
        };

        /**
         * Encodes the specified ProfileManifest message. Does not implicitly {@link omnora.ProfileManifest.verify|verify} messages.
         * @function encode
         * @memberof omnora.ProfileManifest
         * @static
         * @param {omnora.IProfileManifest} message ProfileManifest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProfileManifest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.activeProfile != null && Object.hasOwnProperty.call(message, "activeProfile"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.activeProfile);
            if (message.visibleModules != null && message.visibleModules.length)
                for (var i = 0; i < message.visibleModules.length; ++i)
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.visibleModules[i]);
            if (message.labelOverrides != null && Object.hasOwnProperty.call(message, "labelOverrides"))
                for (var keys = Object.keys(message.labelOverrides), i = 0; i < keys.length; ++i)
                    writer.uint32(/* id 3, wireType 2 =*/26).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.labelOverrides[keys[i]]).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ProfileManifest message, length delimited. Does not implicitly {@link omnora.ProfileManifest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.ProfileManifest
         * @static
         * @param {omnora.IProfileManifest} message ProfileManifest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProfileManifest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ProfileManifest message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.ProfileManifest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.ProfileManifest} ProfileManifest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProfileManifest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.ProfileManifest(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.activeProfile = reader.string();
                    break;
                case 2:
                    if (!(message.visibleModules && message.visibleModules.length))
                        message.visibleModules = [];
                    message.visibleModules.push(reader.string());
                    break;
                case 3:
                    if (message.labelOverrides === $util.emptyObject)
                        message.labelOverrides = {};
                    var end2 = reader.uint32() + reader.pos;
                    key = "";
                    value = "";
                    while (reader.pos < end2) {
                        var tag2 = reader.uint32();
                        switch (tag2 >>> 3) {
                        case 1:
                            key = reader.string();
                            break;
                        case 2:
                            value = reader.string();
                            break;
                        default:
                            reader.skipType(tag2 & 7);
                            break;
                        }
                    }
                    message.labelOverrides[key] = value;
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ProfileManifest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.ProfileManifest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.ProfileManifest} ProfileManifest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProfileManifest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ProfileManifest message.
         * @function verify
         * @memberof omnora.ProfileManifest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ProfileManifest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.activeProfile != null && message.hasOwnProperty("activeProfile"))
                if (!$util.isString(message.activeProfile))
                    return "activeProfile: string expected";
            if (message.visibleModules != null && message.hasOwnProperty("visibleModules")) {
                if (!Array.isArray(message.visibleModules))
                    return "visibleModules: array expected";
                for (var i = 0; i < message.visibleModules.length; ++i)
                    if (!$util.isString(message.visibleModules[i]))
                        return "visibleModules: string[] expected";
            }
            if (message.labelOverrides != null && message.hasOwnProperty("labelOverrides")) {
                if (!$util.isObject(message.labelOverrides))
                    return "labelOverrides: object expected";
                var key = Object.keys(message.labelOverrides);
                for (var i = 0; i < key.length; ++i)
                    if (!$util.isString(message.labelOverrides[key[i]]))
                        return "labelOverrides: string{k:string} expected";
            }
            return null;
        };

        /**
         * Creates a ProfileManifest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.ProfileManifest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.ProfileManifest} ProfileManifest
         */
        ProfileManifest.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.ProfileManifest)
                return object;
            var message = new $root.omnora.ProfileManifest();
            if (object.activeProfile != null)
                message.activeProfile = String(object.activeProfile);
            if (object.visibleModules) {
                if (!Array.isArray(object.visibleModules))
                    throw TypeError(".omnora.ProfileManifest.visibleModules: array expected");
                message.visibleModules = [];
                for (var i = 0; i < object.visibleModules.length; ++i)
                    message.visibleModules[i] = String(object.visibleModules[i]);
            }
            if (object.labelOverrides) {
                if (typeof object.labelOverrides !== "object")
                    throw TypeError(".omnora.ProfileManifest.labelOverrides: object expected");
                message.labelOverrides = {};
                for (var keys = Object.keys(object.labelOverrides), i = 0; i < keys.length; ++i)
                    message.labelOverrides[keys[i]] = String(object.labelOverrides[keys[i]]);
            }
            return message;
        };

        /**
         * Creates a plain object from a ProfileManifest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.ProfileManifest
         * @static
         * @param {omnora.ProfileManifest} message ProfileManifest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ProfileManifest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.visibleModules = [];
            if (options.objects || options.defaults)
                object.labelOverrides = {};
            if (options.defaults)
                object.activeProfile = "";
            if (message.activeProfile != null && message.hasOwnProperty("activeProfile"))
                object.activeProfile = message.activeProfile;
            if (message.visibleModules && message.visibleModules.length) {
                object.visibleModules = [];
                for (var j = 0; j < message.visibleModules.length; ++j)
                    object.visibleModules[j] = message.visibleModules[j];
            }
            var keys2;
            if (message.labelOverrides && (keys2 = Object.keys(message.labelOverrides)).length) {
                object.labelOverrides = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.labelOverrides[keys2[j]] = message.labelOverrides[keys2[j]];
            }
            return object;
        };

        /**
         * Converts this ProfileManifest to JSON.
         * @function toJSON
         * @memberof omnora.ProfileManifest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ProfileManifest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ProfileManifest;
    })();

    omnora.StockLookupRequest = (function() {

        /**
         * Properties of a StockLookupRequest.
         * @memberof omnora
         * @interface IStockLookupRequest
         * @property {string|null} [barcode] StockLookupRequest barcode
         * @property {string|null} [nodeId] StockLookupRequest nodeId
         */

        /**
         * Constructs a new StockLookupRequest.
         * @memberof omnora
         * @classdesc Represents a StockLookupRequest.
         * @implements IStockLookupRequest
         * @constructor
         * @param {omnora.IStockLookupRequest=} [properties] Properties to set
         */
        function StockLookupRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * StockLookupRequest barcode.
         * @member {string} barcode
         * @memberof omnora.StockLookupRequest
         * @instance
         */
        StockLookupRequest.prototype.barcode = "";

        /**
         * StockLookupRequest nodeId.
         * @member {string} nodeId
         * @memberof omnora.StockLookupRequest
         * @instance
         */
        StockLookupRequest.prototype.nodeId = "";

        /**
         * Creates a new StockLookupRequest instance using the specified properties.
         * @function create
         * @memberof omnora.StockLookupRequest
         * @static
         * @param {omnora.IStockLookupRequest=} [properties] Properties to set
         * @returns {omnora.StockLookupRequest} StockLookupRequest instance
         */
        StockLookupRequest.create = function create(properties) {
            return new StockLookupRequest(properties);
        };

        /**
         * Encodes the specified StockLookupRequest message. Does not implicitly {@link omnora.StockLookupRequest.verify|verify} messages.
         * @function encode
         * @memberof omnora.StockLookupRequest
         * @static
         * @param {omnora.IStockLookupRequest} message StockLookupRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StockLookupRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.barcode != null && Object.hasOwnProperty.call(message, "barcode"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.barcode);
            if (message.nodeId != null && Object.hasOwnProperty.call(message, "nodeId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.nodeId);
            return writer;
        };

        /**
         * Encodes the specified StockLookupRequest message, length delimited. Does not implicitly {@link omnora.StockLookupRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.StockLookupRequest
         * @static
         * @param {omnora.IStockLookupRequest} message StockLookupRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StockLookupRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a StockLookupRequest message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.StockLookupRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.StockLookupRequest} StockLookupRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StockLookupRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.StockLookupRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.barcode = reader.string();
                    break;
                case 2:
                    message.nodeId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a StockLookupRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.StockLookupRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.StockLookupRequest} StockLookupRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StockLookupRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a StockLookupRequest message.
         * @function verify
         * @memberof omnora.StockLookupRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        StockLookupRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.barcode != null && message.hasOwnProperty("barcode"))
                if (!$util.isString(message.barcode))
                    return "barcode: string expected";
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                if (!$util.isString(message.nodeId))
                    return "nodeId: string expected";
            return null;
        };

        /**
         * Creates a StockLookupRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.StockLookupRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.StockLookupRequest} StockLookupRequest
         */
        StockLookupRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.StockLookupRequest)
                return object;
            var message = new $root.omnora.StockLookupRequest();
            if (object.barcode != null)
                message.barcode = String(object.barcode);
            if (object.nodeId != null)
                message.nodeId = String(object.nodeId);
            return message;
        };

        /**
         * Creates a plain object from a StockLookupRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.StockLookupRequest
         * @static
         * @param {omnora.StockLookupRequest} message StockLookupRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        StockLookupRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.barcode = "";
                object.nodeId = "";
            }
            if (message.barcode != null && message.hasOwnProperty("barcode"))
                object.barcode = message.barcode;
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                object.nodeId = message.nodeId;
            return object;
        };

        /**
         * Converts this StockLookupRequest to JSON.
         * @function toJSON
         * @memberof omnora.StockLookupRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        StockLookupRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return StockLookupRequest;
    })();

    omnora.StockLookupResponse = (function() {

        /**
         * Properties of a StockLookupResponse.
         * @memberof omnora
         * @interface IStockLookupResponse
         * @property {string|null} [skuId] StockLookupResponse skuId
         * @property {string|null} [skuCode] StockLookupResponse skuCode
         * @property {string|null} [name] StockLookupResponse name
         * @property {string|null} [qtyOnHand] StockLookupResponse qtyOnHand
         * @property {string|null} [unit] StockLookupResponse unit
         * @property {string|null} [costPrice] StockLookupResponse costPrice
         * @property {string|null} [salePrice] StockLookupResponse salePrice
         * @property {string|null} [location] StockLookupResponse location
         */

        /**
         * Constructs a new StockLookupResponse.
         * @memberof omnora
         * @classdesc Represents a StockLookupResponse.
         * @implements IStockLookupResponse
         * @constructor
         * @param {omnora.IStockLookupResponse=} [properties] Properties to set
         */
        function StockLookupResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * StockLookupResponse skuId.
         * @member {string} skuId
         * @memberof omnora.StockLookupResponse
         * @instance
         */
        StockLookupResponse.prototype.skuId = "";

        /**
         * StockLookupResponse skuCode.
         * @member {string} skuCode
         * @memberof omnora.StockLookupResponse
         * @instance
         */
        StockLookupResponse.prototype.skuCode = "";

        /**
         * StockLookupResponse name.
         * @member {string} name
         * @memberof omnora.StockLookupResponse
         * @instance
         */
        StockLookupResponse.prototype.name = "";

        /**
         * StockLookupResponse qtyOnHand.
         * @member {string} qtyOnHand
         * @memberof omnora.StockLookupResponse
         * @instance
         */
        StockLookupResponse.prototype.qtyOnHand = "";

        /**
         * StockLookupResponse unit.
         * @member {string} unit
         * @memberof omnora.StockLookupResponse
         * @instance
         */
        StockLookupResponse.prototype.unit = "";

        /**
         * StockLookupResponse costPrice.
         * @member {string} costPrice
         * @memberof omnora.StockLookupResponse
         * @instance
         */
        StockLookupResponse.prototype.costPrice = "";

        /**
         * StockLookupResponse salePrice.
         * @member {string} salePrice
         * @memberof omnora.StockLookupResponse
         * @instance
         */
        StockLookupResponse.prototype.salePrice = "";

        /**
         * StockLookupResponse location.
         * @member {string} location
         * @memberof omnora.StockLookupResponse
         * @instance
         */
        StockLookupResponse.prototype.location = "";

        /**
         * Creates a new StockLookupResponse instance using the specified properties.
         * @function create
         * @memberof omnora.StockLookupResponse
         * @static
         * @param {omnora.IStockLookupResponse=} [properties] Properties to set
         * @returns {omnora.StockLookupResponse} StockLookupResponse instance
         */
        StockLookupResponse.create = function create(properties) {
            return new StockLookupResponse(properties);
        };

        /**
         * Encodes the specified StockLookupResponse message. Does not implicitly {@link omnora.StockLookupResponse.verify|verify} messages.
         * @function encode
         * @memberof omnora.StockLookupResponse
         * @static
         * @param {omnora.IStockLookupResponse} message StockLookupResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StockLookupResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.skuId != null && Object.hasOwnProperty.call(message, "skuId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.skuId);
            if (message.skuCode != null && Object.hasOwnProperty.call(message, "skuCode"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.skuCode);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
            if (message.qtyOnHand != null && Object.hasOwnProperty.call(message, "qtyOnHand"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.qtyOnHand);
            if (message.unit != null && Object.hasOwnProperty.call(message, "unit"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.unit);
            if (message.costPrice != null && Object.hasOwnProperty.call(message, "costPrice"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.costPrice);
            if (message.salePrice != null && Object.hasOwnProperty.call(message, "salePrice"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.salePrice);
            if (message.location != null && Object.hasOwnProperty.call(message, "location"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.location);
            return writer;
        };

        /**
         * Encodes the specified StockLookupResponse message, length delimited. Does not implicitly {@link omnora.StockLookupResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.StockLookupResponse
         * @static
         * @param {omnora.IStockLookupResponse} message StockLookupResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StockLookupResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a StockLookupResponse message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.StockLookupResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.StockLookupResponse} StockLookupResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StockLookupResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.StockLookupResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.skuId = reader.string();
                    break;
                case 2:
                    message.skuCode = reader.string();
                    break;
                case 3:
                    message.name = reader.string();
                    break;
                case 4:
                    message.qtyOnHand = reader.string();
                    break;
                case 5:
                    message.unit = reader.string();
                    break;
                case 6:
                    message.costPrice = reader.string();
                    break;
                case 7:
                    message.salePrice = reader.string();
                    break;
                case 8:
                    message.location = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a StockLookupResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.StockLookupResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.StockLookupResponse} StockLookupResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StockLookupResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a StockLookupResponse message.
         * @function verify
         * @memberof omnora.StockLookupResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        StockLookupResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.skuId != null && message.hasOwnProperty("skuId"))
                if (!$util.isString(message.skuId))
                    return "skuId: string expected";
            if (message.skuCode != null && message.hasOwnProperty("skuCode"))
                if (!$util.isString(message.skuCode))
                    return "skuCode: string expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.qtyOnHand != null && message.hasOwnProperty("qtyOnHand"))
                if (!$util.isString(message.qtyOnHand))
                    return "qtyOnHand: string expected";
            if (message.unit != null && message.hasOwnProperty("unit"))
                if (!$util.isString(message.unit))
                    return "unit: string expected";
            if (message.costPrice != null && message.hasOwnProperty("costPrice"))
                if (!$util.isString(message.costPrice))
                    return "costPrice: string expected";
            if (message.salePrice != null && message.hasOwnProperty("salePrice"))
                if (!$util.isString(message.salePrice))
                    return "salePrice: string expected";
            if (message.location != null && message.hasOwnProperty("location"))
                if (!$util.isString(message.location))
                    return "location: string expected";
            return null;
        };

        /**
         * Creates a StockLookupResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.StockLookupResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.StockLookupResponse} StockLookupResponse
         */
        StockLookupResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.StockLookupResponse)
                return object;
            var message = new $root.omnora.StockLookupResponse();
            if (object.skuId != null)
                message.skuId = String(object.skuId);
            if (object.skuCode != null)
                message.skuCode = String(object.skuCode);
            if (object.name != null)
                message.name = String(object.name);
            if (object.qtyOnHand != null)
                message.qtyOnHand = String(object.qtyOnHand);
            if (object.unit != null)
                message.unit = String(object.unit);
            if (object.costPrice != null)
                message.costPrice = String(object.costPrice);
            if (object.salePrice != null)
                message.salePrice = String(object.salePrice);
            if (object.location != null)
                message.location = String(object.location);
            return message;
        };

        /**
         * Creates a plain object from a StockLookupResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.StockLookupResponse
         * @static
         * @param {omnora.StockLookupResponse} message StockLookupResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        StockLookupResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.skuId = "";
                object.skuCode = "";
                object.name = "";
                object.qtyOnHand = "";
                object.unit = "";
                object.costPrice = "";
                object.salePrice = "";
                object.location = "";
            }
            if (message.skuId != null && message.hasOwnProperty("skuId"))
                object.skuId = message.skuId;
            if (message.skuCode != null && message.hasOwnProperty("skuCode"))
                object.skuCode = message.skuCode;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.qtyOnHand != null && message.hasOwnProperty("qtyOnHand"))
                object.qtyOnHand = message.qtyOnHand;
            if (message.unit != null && message.hasOwnProperty("unit"))
                object.unit = message.unit;
            if (message.costPrice != null && message.hasOwnProperty("costPrice"))
                object.costPrice = message.costPrice;
            if (message.salePrice != null && message.hasOwnProperty("salePrice"))
                object.salePrice = message.salePrice;
            if (message.location != null && message.hasOwnProperty("location"))
                object.location = message.location;
            return object;
        };

        /**
         * Converts this StockLookupResponse to JSON.
         * @function toJSON
         * @memberof omnora.StockLookupResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        StockLookupResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return StockLookupResponse;
    })();

    omnora.ReadReceipt = (function() {

        /**
         * Properties of a ReadReceipt.
         * @memberof omnora
         * @interface IReadReceipt
         * @property {string|null} [messageId] ReadReceipt messageId
         * @property {string|null} [fromNodeId] ReadReceipt fromNodeId
         * @property {number|Long|null} [readAt] ReadReceipt readAt
         */

        /**
         * Constructs a new ReadReceipt.
         * @memberof omnora
         * @classdesc Represents a ReadReceipt.
         * @implements IReadReceipt
         * @constructor
         * @param {omnora.IReadReceipt=} [properties] Properties to set
         */
        function ReadReceipt(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ReadReceipt messageId.
         * @member {string} messageId
         * @memberof omnora.ReadReceipt
         * @instance
         */
        ReadReceipt.prototype.messageId = "";

        /**
         * ReadReceipt fromNodeId.
         * @member {string} fromNodeId
         * @memberof omnora.ReadReceipt
         * @instance
         */
        ReadReceipt.prototype.fromNodeId = "";

        /**
         * ReadReceipt readAt.
         * @member {number|Long} readAt
         * @memberof omnora.ReadReceipt
         * @instance
         */
        ReadReceipt.prototype.readAt = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new ReadReceipt instance using the specified properties.
         * @function create
         * @memberof omnora.ReadReceipt
         * @static
         * @param {omnora.IReadReceipt=} [properties] Properties to set
         * @returns {omnora.ReadReceipt} ReadReceipt instance
         */
        ReadReceipt.create = function create(properties) {
            return new ReadReceipt(properties);
        };

        /**
         * Encodes the specified ReadReceipt message. Does not implicitly {@link omnora.ReadReceipt.verify|verify} messages.
         * @function encode
         * @memberof omnora.ReadReceipt
         * @static
         * @param {omnora.IReadReceipt} message ReadReceipt message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReadReceipt.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.messageId != null && Object.hasOwnProperty.call(message, "messageId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.messageId);
            if (message.fromNodeId != null && Object.hasOwnProperty.call(message, "fromNodeId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.fromNodeId);
            if (message.readAt != null && Object.hasOwnProperty.call(message, "readAt"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.readAt);
            return writer;
        };

        /**
         * Encodes the specified ReadReceipt message, length delimited. Does not implicitly {@link omnora.ReadReceipt.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.ReadReceipt
         * @static
         * @param {omnora.IReadReceipt} message ReadReceipt message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReadReceipt.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ReadReceipt message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.ReadReceipt
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.ReadReceipt} ReadReceipt
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ReadReceipt.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.ReadReceipt();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.messageId = reader.string();
                    break;
                case 2:
                    message.fromNodeId = reader.string();
                    break;
                case 3:
                    message.readAt = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ReadReceipt message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.ReadReceipt
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.ReadReceipt} ReadReceipt
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ReadReceipt.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ReadReceipt message.
         * @function verify
         * @memberof omnora.ReadReceipt
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ReadReceipt.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.messageId != null && message.hasOwnProperty("messageId"))
                if (!$util.isString(message.messageId))
                    return "messageId: string expected";
            if (message.fromNodeId != null && message.hasOwnProperty("fromNodeId"))
                if (!$util.isString(message.fromNodeId))
                    return "fromNodeId: string expected";
            if (message.readAt != null && message.hasOwnProperty("readAt"))
                if (!$util.isInteger(message.readAt) && !(message.readAt && $util.isInteger(message.readAt.low) && $util.isInteger(message.readAt.high)))
                    return "readAt: integer|Long expected";
            return null;
        };

        /**
         * Creates a ReadReceipt message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.ReadReceipt
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.ReadReceipt} ReadReceipt
         */
        ReadReceipt.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.ReadReceipt)
                return object;
            var message = new $root.omnora.ReadReceipt();
            if (object.messageId != null)
                message.messageId = String(object.messageId);
            if (object.fromNodeId != null)
                message.fromNodeId = String(object.fromNodeId);
            if (object.readAt != null)
                if ($util.Long)
                    (message.readAt = $util.Long.fromValue(object.readAt)).unsigned = false;
                else if (typeof object.readAt === "string")
                    message.readAt = parseInt(object.readAt, 10);
                else if (typeof object.readAt === "number")
                    message.readAt = object.readAt;
                else if (typeof object.readAt === "object")
                    message.readAt = new $util.LongBits(object.readAt.low >>> 0, object.readAt.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a ReadReceipt message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.ReadReceipt
         * @static
         * @param {omnora.ReadReceipt} message ReadReceipt
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ReadReceipt.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.messageId = "";
                object.fromNodeId = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.readAt = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.readAt = options.longs === String ? "0" : 0;
            }
            if (message.messageId != null && message.hasOwnProperty("messageId"))
                object.messageId = message.messageId;
            if (message.fromNodeId != null && message.hasOwnProperty("fromNodeId"))
                object.fromNodeId = message.fromNodeId;
            if (message.readAt != null && message.hasOwnProperty("readAt"))
                if (typeof message.readAt === "number")
                    object.readAt = options.longs === String ? String(message.readAt) : message.readAt;
                else
                    object.readAt = options.longs === String ? $util.Long.prototype.toString.call(message.readAt) : options.longs === Number ? new $util.LongBits(message.readAt.low >>> 0, message.readAt.high >>> 0).toNumber() : message.readAt;
            return object;
        };

        /**
         * Converts this ReadReceipt to JSON.
         * @function toJSON
         * @memberof omnora.ReadReceipt
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ReadReceipt.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ReadReceipt;
    })();

    omnora.PresenceUpdate = (function() {

        /**
         * Properties of a PresenceUpdate.
         * @memberof omnora
         * @interface IPresenceUpdate
         * @property {string|null} [nodeId] PresenceUpdate nodeId
         * @property {string|null} [status] PresenceUpdate status
         * @property {number|Long|null} [timestamp] PresenceUpdate timestamp
         */

        /**
         * Constructs a new PresenceUpdate.
         * @memberof omnora
         * @classdesc Represents a PresenceUpdate.
         * @implements IPresenceUpdate
         * @constructor
         * @param {omnora.IPresenceUpdate=} [properties] Properties to set
         */
        function PresenceUpdate(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PresenceUpdate nodeId.
         * @member {string} nodeId
         * @memberof omnora.PresenceUpdate
         * @instance
         */
        PresenceUpdate.prototype.nodeId = "";

        /**
         * PresenceUpdate status.
         * @member {string} status
         * @memberof omnora.PresenceUpdate
         * @instance
         */
        PresenceUpdate.prototype.status = "";

        /**
         * PresenceUpdate timestamp.
         * @member {number|Long} timestamp
         * @memberof omnora.PresenceUpdate
         * @instance
         */
        PresenceUpdate.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new PresenceUpdate instance using the specified properties.
         * @function create
         * @memberof omnora.PresenceUpdate
         * @static
         * @param {omnora.IPresenceUpdate=} [properties] Properties to set
         * @returns {omnora.PresenceUpdate} PresenceUpdate instance
         */
        PresenceUpdate.create = function create(properties) {
            return new PresenceUpdate(properties);
        };

        /**
         * Encodes the specified PresenceUpdate message. Does not implicitly {@link omnora.PresenceUpdate.verify|verify} messages.
         * @function encode
         * @memberof omnora.PresenceUpdate
         * @static
         * @param {omnora.IPresenceUpdate} message PresenceUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PresenceUpdate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nodeId != null && Object.hasOwnProperty.call(message, "nodeId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.nodeId);
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.status);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.timestamp);
            return writer;
        };

        /**
         * Encodes the specified PresenceUpdate message, length delimited. Does not implicitly {@link omnora.PresenceUpdate.verify|verify} messages.
         * @function encodeDelimited
         * @memberof omnora.PresenceUpdate
         * @static
         * @param {omnora.IPresenceUpdate} message PresenceUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PresenceUpdate.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PresenceUpdate message from the specified reader or buffer.
         * @function decode
         * @memberof omnora.PresenceUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omnora.PresenceUpdate} PresenceUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PresenceUpdate.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.omnora.PresenceUpdate();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nodeId = reader.string();
                    break;
                case 2:
                    message.status = reader.string();
                    break;
                case 3:
                    message.timestamp = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PresenceUpdate message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof omnora.PresenceUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {omnora.PresenceUpdate} PresenceUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PresenceUpdate.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PresenceUpdate message.
         * @function verify
         * @memberof omnora.PresenceUpdate
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PresenceUpdate.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                if (!$util.isString(message.nodeId))
                    return "nodeId: string expected";
            if (message.status != null && message.hasOwnProperty("status"))
                if (!$util.isString(message.status))
                    return "status: string expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            return null;
        };

        /**
         * Creates a PresenceUpdate message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof omnora.PresenceUpdate
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {omnora.PresenceUpdate} PresenceUpdate
         */
        PresenceUpdate.fromObject = function fromObject(object) {
            if (object instanceof $root.omnora.PresenceUpdate)
                return object;
            var message = new $root.omnora.PresenceUpdate();
            if (object.nodeId != null)
                message.nodeId = String(object.nodeId);
            if (object.status != null)
                message.status = String(object.status);
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a PresenceUpdate message. Also converts values to other types if specified.
         * @function toObject
         * @memberof omnora.PresenceUpdate
         * @static
         * @param {omnora.PresenceUpdate} message PresenceUpdate
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PresenceUpdate.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.nodeId = "";
                object.status = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
            }
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                object.nodeId = message.nodeId;
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = message.status;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            return object;
        };

        /**
         * Converts this PresenceUpdate to JSON.
         * @function toJSON
         * @memberof omnora.PresenceUpdate
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PresenceUpdate.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PresenceUpdate;
    })();

    return omnora;
})();

module.exports = $root;
