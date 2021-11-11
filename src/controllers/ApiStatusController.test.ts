import app from '../index';
import supertest from 'supertest';
const request = supertest(app);

it('Should return message that server is on', async () => {
  const response = await request.get('/');
  expect(response.status).toBe(200);
  expect(response.body.message).toBe('O servidor esta rodando...');
  const response2 = await request.get('/quit');
});


afterEach(() => {
  //app.listen().close();
  request.removeAllListeners;
  app.removeAllListeners;
  //request.removeAllListeners;
  //const response = request.get('/quit');
});