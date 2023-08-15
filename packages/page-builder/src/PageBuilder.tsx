import { Form, useForm } from '@artsiombarouski/rn-form';
import { FormPageBuilder } from './FormPageBuilder';

export type PageBuilderProps = {};

export const PageBuilder = (props: PageBuilderProps) => {
  const form = useForm();

  return (
    <Form form={form}>
      <FormPageBuilder name={'data'} />
    </Form>
  );
};
