const { test, expect } = require('@playwright/test');
const {Ajv} = require("ajv");

const ajv = new Ajv()

test.describe('Reqres API Automation', () => {
  test('GET Single User', async ({ request }) => {
    const response = await request.get('https://reqres.in/api/users/2');

    // Assertion: Status Code
    expect(response.status()).toBe(200);

    const responseData = await response.json();

    expect(responseData.data.id).toBe(2);
    expect(responseData.data.email).toBe("janet.weaver@reqres.in");
    expect(responseData.data.first_name).toBe("Janet"); 
    expect(responseData.data.last_name).toBe("Weaver");
    expect(responseData.data.avatar).toBe("https://reqres.in/img/faces/2-image.jpg");

    // Assertion: Schema Validation
    const valid = ajv.validate(require('./schemas/getUser-schema.json'), responseData);

    if (!valid) {
      console.error('Validation Errors:', ajv.errorsText());
    }

    expect(valid).toBe(true);

    console.log(response.status());
  });


  test('POST Create User', async ({ request }) => {
    const bodyData = {
      name: 'Ari Krisna',
      job: 'QA Engineer',
    };

    const response = await request.post('https://reqres.in/api/users', { data: bodyData });
    const responseBody = await response.json();

    // Assertion: Status Code
    expect(response.status()).toBe(201);

    // Assertion: Schema Validation
    const valid = ajv.validate(require('./schemas/createUser-schema.json'), responseBody)
    expect(valid).toBe(true);

    if (!valid) {
        console.error('Validation Errors:', ajv.errorsText());
      }

    console.log(response.status());
    console.log(await response.json());
  });


  test('PUT Update User', async ({ request }) => {
    const payload = {
      name: 'Ari Krisnadewi',
      job: 'Senior QA Engineer',
    };

    const response = await request.put('https://reqres.in/api/users/2', { data: payload });
    const responseBody = await response.json();

    // Assertion: Status Code
    expect(response.status()).toBe(200);

    // Assertion: Schema Validation
    const valid = ajv.validate(require('./schemas/updateUser-schema.json'), responseBody)
    expect(valid).toBe(true);

    if (!valid) {
        console.error("Ajv validation errors:", ajv.errorsText());
    }

    console.log(response.status());
    console.log(await response.json());
  });


  test('DELETE User', async ({ request }) => {
    const response = await request.delete('https://reqres.in/api/users/2');

    // Assertion: Status Code
    expect(response.status()).toBe(204);

    console.log(response.status());
  });
});