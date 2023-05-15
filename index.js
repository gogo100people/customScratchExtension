
// create by scratch3-extension generator
const ArgumentType = Scratch.ArgumentType;
const BlockType = Scratch.BlockType;
const formatMessage = Scratch.formatMessage;
const log = Scratch.log;

const menuIconURI = null;
const blockIconURI = null;

class javascriptExt{
  constructor (runtime){
    this.runtime = runtime;
    // communication related
    this.comm = runtime.ioDevices.comm;
    this.session = null;
    this.runtime.registerPeripheralExtension('javascriptExt', this);
    // session callbacks
    this.reporter = null;
    this.onmessage = this.onmessage.bind(this);
    this.onclose = this.onclose.bind(this);
    this.write = this.write.bind(this);
    // string op
    this.decoder = new TextDecoder();
    this.lineBuffer = '';
  }

  onclose (){
    this.session = null;
  }

  write (data, parser = null){
    if (this.session){
      return new Promise(resolve => {
        if (parser){
          this.reporter = {
            parser,
            resolve
          }
        }
        this.session.write(data);
      })
    }
  }

  onmessage (data){
    const dataStr = this.decoder.decode(data);
    this.lineBuffer += dataStr;
    if (this.lineBuffer.indexOf('\n') !== -1){
      const lines = this.lineBuffer.split('\n');
      this.lineBuffer = lines.pop();
      for (const l of lines){
        if (this.reporter){
          const {parser, resolve} = this.reporter;
          resolve(parser(l));
        };
      }
    }
  }

  scan (){
    this.comm.getDeviceList().then(result => {
        this.runtime.emit(this.runtime.constructor.PERIPHERAL_LIST_UPDATE, result);
    });
  }

  getInfo (){
    return {
      id: 'javascriptExt',
      name: 'Javascript',
      color1: '#ff0004',
      color2: '#ff0000',
      menuIconURI: menuIconURI,
      blockIconURI: blockIconURI,
      blocks: [
        {
          opcode: 'alertBlock',
          blockType: BlockType.COMMAND,
          arguments: {
            Text: {
              type: ArgumentType.STRING
            }
          },
          text: 'Alert [Text]'
        },
        {
          opcode: 'promptBlock',
          blockType: BlockType.REPORTER,
          arguments: {
            Prompt: {
              type: ArgumentType.STRING
            }
          },
          text: 'Ask With Prompt [Prompt]'
        },
        {
          opcode: 'trueBoolean',
          blockType: BlockType.BOOLEAN,
          text: 'True'
        },
        {
          opcode: 'falseBoolean',
          blockType: BlockType.BOOLEAN,
          text: 'False'
        }
      ]
    }
  }

alertBlock (args, util);{
  const Text = args.Text;
alert(Text)
  return this.write(`M0 \n`);
}

promptBlock (args, util);{
  const Prompt = args.Prompt;
let output = prompt(Prompt)
  return this.write(output);
}

trueBoolean (args, util);{

  return this.write(`true`);
}

falseBoolean (args, util);{

  return this.write(`false`);
}

}

module.exports = javascriptExt;
