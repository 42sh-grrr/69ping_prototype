
declare module "*.module.scss" {
  type Foo = {
    [key: string]: string
  };
  namespace foo {}
  const foo: Foo;
  export = foo;
}

declare module "*.png" {
  const foo: string;
  export default foo;
}
