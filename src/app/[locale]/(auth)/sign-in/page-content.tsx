"use client";
import CommonIcons from "@/components/CommonIcons";
import FormikField from "@/components/CustomFieldsFormik/FormikField";
import InputField from "@/components/CustomFieldsFormik/InputField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import urls from "@/constants/urls";
import { Link } from "@/lib/i18nNavigation";
import { useAuth } from "@/providers/AuthenticationProvider";
import { showError } from "@/utils/toast";
import { Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import * as Yup from "yup";

const PageContent = () => {
  const { login } = useAuth();
  const t = useTranslations();

  return (
    <div className="component:Login flex h-[100vh] w-[100vw] items-center justify-center p-2">
      <Formik
        validationSchema={Yup.object().shape({
          username: Yup.string().required("Username is required field!"),
          password: Yup.string().required("Password is required field!"),
        })}
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          const { username, password } = values;
          console.log({ login });
          login({
            username,
            password,
            onSuccess: (user) => {
              if (user.role === "admin") {
                window.location.href = urls.Admin.Dashboard;
              } else if (user.role === "user") {
                window.location.href = urls.User.Dashboard;
              } else {
                window.location.href = urls.Homepage;
              }
            },
            onFailed: (error) => {
              showError(error);
            },
          });
        }}
      >
        {({ isSubmitting }) => {
          return (
            <Form className="min-w-[500px]">
              <div className="mb-8 flex justify-center text-3xl font-bold">Logo here</div>
              <Card className="shadow-md">
                <CardHeader className="pb-5">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Login (donezombie / donezombie)
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Enter your username and password below
                    <br />
                    to log into your account
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                  <FormikField
                    component={InputField}
                    name="username"
                    label="Username"
                    placeholder="Enter your username"
                    required
                  />

                  <FormikField
                    component={InputField}
                    name="password"
                    type="password"
                    label="Password"
                    placeholder="Enter your password"
                    required
                  />

                  <Link
                    href={urls.Homepage}
                    className="is-link text-right text-sm text-muted-foreground"
                  >
                    Forgot password?
                  </Link>

                  <Button type="submit" isLoading={isSubmitting}>
                    {t("Counter.security_powered_by")}
                    <CommonIcons.LogIn className="icon" /> {t("Shared.login")}
                  </Button>
                </CardContent>
              </Card>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default PageContent;
