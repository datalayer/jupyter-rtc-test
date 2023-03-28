describe('@datalayer/jupyter-rtc-test', () => {
  it('should be tested', () => {
    const arr = [ 1, 5, 7, 3 ];
    const sum = arr.reduce((a: number, b: number) => {
      return a + b;
    }, 0);
    expect(16).toEqual(sum);
  });
});
