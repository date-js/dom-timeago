import App from './App';

const app = new App();

const DomTimeago = {
  start: app.start.bind(app),
  stop: app.stop.bind(app)
};

export default DomTimeago;
