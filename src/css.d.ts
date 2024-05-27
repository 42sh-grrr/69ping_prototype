
declare module "*.module.scss" {
  type Foo = {
    [key: string]: string
  };
  namespace foo {}
  const foo: Foo;
  export = foo;
}
