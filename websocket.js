const WebSocketServer = require("ws").Server;
const fs = require("fs");

let wss = new WebSocketServer({port: 8080});


function replaceTextInBuffer(ws, bufferString, text) {
    const searchString = "!cmds";
    const replacement = text;

    let modifiedString = bufferString.toString().replace(searchString, replacement);

    let modifiedBuffer = Buffer.from(modifiedString, 'utf-8');

    ws.send(modifiedBuffer);
}

wss.on("connection", (socket, request) => {
    socket.on("message", msg => {
        const decoder = new GpBinaryV16Decoder(msg);
        const decodedData = decoder.decode();
        console.log(decodedData);
    });

    console.log("Connected to BLF websocket!");
});

class GpBinaryV16Decoder {
    constructor(buffer) {
      this.buffer = buffer;
      this.offset = 0;
    }
  
    // Helper method to read unsigned 8-bit integer
    readUInt8() {
      this.checkOffset(1);
      const value = this.buffer.readUInt8(this.offset);
      this.offset += 1;
      return value;
    }
  
    // Helper method to read unsigned 16-bit integer
    readUInt16() {
      this.checkOffset(2);
      const value = this.buffer.readUInt16BE(this.offset);
      this.offset += 2;
      return value;
    }
  
    // Helper method to read unsigned 32-bit integer
    readUInt32() {
      this.checkOffset(4);
      const value = this.buffer.readUInt32BE(this.offset);
      this.offset += 4;
      return value;
    }
  
    // Helper method to read float
    readFloat() {
      this.checkOffset(4);
      const value = this.buffer.readFloatBE(this.offset);
      this.offset += 4;
      return value;
    }
  
    // Helper method to read double
    readDouble() {
      this.checkOffset(8);
      const value = this.buffer.readDoubleBE(this.offset);
      this.offset += 8;
      return value;
    }
  
    // Helper method to read a string
    readString() {
      const length = this.readUInt16(); // Assuming length is stored as 16-bit integer
      this.checkOffset(length);
      const value = this.buffer.toString('utf8', this.offset, this.offset + length);
      this.offset += length;
      return value;
    }
  
    // Check if there's enough data left in the buffer to read
    checkOffset(length) {
      if (this.offset + length > this.buffer.length) {
        throw new RangeError(`Attempt to read beyond buffer length. Offset: ${this.offset}, Length: ${length}, Buffer Length: ${this.buffer.length}`);
      }
    }
  
    // Method to decode the binary data
    decode() {
      const result = {};
      result.version = this.readUInt8(); // Read a version byte
      result.id = this.readUInt32(); // Read an ID (32-bit integer)
      result.name = this.readString(); // Read a name (string)
      result.value = this.readDouble(); // Read a value (double)
      
      // Assuming there is a nested structure
      const nestedCount = this.readUInt8(); // Number of nested structures
      result.nested = [];
      
      for (let i = 0; i < nestedCount; i++) {
        const nested = {};
        nested.type = this.readUInt8(); // Read type (8-bit integer)
        nested.data = this.readString(); // Read data (string)
        result.nested.push(nested);
      }
      
      return result;
    }
  }
  // Usage example:
  
  // Simulate binary data (for the sake of example)
  const buffer = Buffer.from([
    0x10,                   // Version
    0x00, 0x00, 0x00, 0x01, // ID
    0x00, 0x05,             // Name length
    0x48, 0x65, 0x6C, 0x6C, 0x6F, // Name ("Hello")
    0x40, 0x09, 0x21, 0xFB, 0x54, 0x44, 0x2D, 0x18, // Value (3.14 as double)
    0x02,                   // Number of nested structures
    0x01, 0x00, 0x03, 0x41, 0x42, 0x43, // Nested structure 1
    0x02, 0x00, 0x03, 0x44, 0x45, 0x46  // Nested structure 2
  ]);
  
  const decoder = new GpBinaryV16Decoder(buffer);
  const decodedData = decoder.decode();
  console.log(decodedData);
  