import { setupServer, superRequest } from '../../jest.utils';

describe('POST /challenge/coderoad-challenge-completed', () => {
  let setCookies: string[];

  setupServer();

  beforeEach(async () => {
    const res = await superRequest('/auth/dev-callback', { method: 'GET' });
    expect(res.status).toBe(200);
    setCookies = res.get('Set-Cookie');
  });

  test('should return 500 if no tutorialId', async () => {
    const response = await superRequest(
      '/challenge/coderoad-challenge-completed',
      { method: 'POST', setCookies }
    );
    expect(response.status).toBe(500);
  });

  test('should return 400 if no user token', async () => {
    const response = await superRequest(
      '/challenge/coderoad-challenge-completed',
      { method: 'POST', setCookies }
    )
      .set('Accept', 'application/json')
      .send({
        tutorialId: 'freeCodeCamp/learn-bash-by-building-a-boilerplate:v1.0.0'
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      msg: `'coderoad-user-token' not found in request headers`
    });
  });

  test('should return 400 if invalid user token', async () => {
    const response = await superRequest(
      '/challenge/coderoad-challenge-completed',
      { method: 'POST', setCookies }
    )
      .set('Accept', 'application/json')
      .set('coderoad-user-token', 'invalid')
      .send({
        tutorialId: 'freeCodeCamp/learn-bash-by-building-a-boilerplate:v1.0.0'
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ msg: `invalid user token` });
  });

  // test('should return 400 if invalid tutorialId', async () => {
  //     const response = await superRequest('/challenge/coderoad-challenge-completed', { method: 'POST', setCookies }).set('Accept', 'application/json').set('coderoad-user-token', 'eyJ1c2VyVG9rZW4iOiJ0ZXN0In0=').send({ tutorialId: 'invalid' });
  //     expect(response.status).toBe(400);
  //     expect(response.body).toEqual({ msg: `'tutorialId' not found in request body` });
  // });
});
