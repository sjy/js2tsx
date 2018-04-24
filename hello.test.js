test('the data is peanut butter', () => {
  expect.assertions(1);
  return Promise.resolve('peanut butter').then(data => {
    expect(data).toBe('peanut butter');
  });
});
