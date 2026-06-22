import React, { useState } from "react";
import {
  Card,
  FormLayout,
  TextField,
  Select,
  Checkbox,
  RadioButton,
  ChoiceList,
  Button,
  Text,
  Banner,
  BlockStack,
} from "@shopify/polaris";

export default function FormSection() {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [gender, setGender] = useState("male");
  const [interests, setInterests] = useState([]);

  const [submittedData, setSubmittedData] = useState(null);
  const [error, setError] = useState("");

  const countryOptions = [
    { label: "Select Country", value: "" },
    { label: "India", value: "India" },
    { label: "United States", value: "USA" },
    { label: "Canada", value: "Canada" },
  ];

  const handleSubmit = () => {
    setError("");

    // Validation
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!country) {
      setError("Please select a country.");
      return;
    }

    if (!acceptTerms) {
      setError("Please accept the terms and conditions.");
      return;
    }

    setSubmittedData({
      name,
      country,
      gender,
      interests,
      acceptTerms,
    });
  };

  return (
    <Card>
      <BlockStack gap="400">

        <Text variant="headingMd" as="h2">
          Form Components Section
        </Text>

        {error && (
          <Banner
            title="Validation Error"
            tone="critical"
            onDismiss={() => setError("")}
          >
            <p>{error}</p>
          </Banner>
        )}

        <FormLayout>

          {/* TextField */}
          <TextField
            label="Full Name"
            value={name}
            onChange={setName}
            autoComplete="off"
          />

          {/* Select */}
          <Select
            label="Country"
            options={countryOptions}
            value={country}
            onChange={setCountry}
          />

          {/* Radio Buttons */}
          <BlockStack gap="200">
            <Text variant="bodyMd" fontWeight="medium">
              Gender
            </Text>

            <RadioButton
              label="Male"
              checked={gender === "male"}
              id="male"
              name="gender"
              onChange={() => setGender("male")}
            />

            <RadioButton
              label="Female"
              checked={gender === "female"}
              id="female"
              name="gender"
              onChange={() => setGender("female")}
            />
          </BlockStack>

          {/* ChoiceList */}
          <ChoiceList
            title="Interests"
            allowMultiple
            choices={[
              { label: "Shopify", value: "Shopify" },
              { label: "React", value: "React" },
              { label: "Laravel", value: "Laravel" },
            ]}
            selected={interests}
            onChange={setInterests}
          />

          {/* Checkbox */}
          <Checkbox
            label="I accept Terms & Conditions"
            checked={acceptTerms}
            onChange={setAcceptTerms}
          />

          <Button variant="primary" onClick={handleSubmit}>
            Submit Form
          </Button>

        </FormLayout>

        {/* Submitted Values */}
        {submittedData && (
          <Banner title="Form Submitted Successfully" tone="success">
            <BlockStack gap="100">
              <Text>Name: {submittedData.name}</Text>
              <Text>Country: {submittedData.country}</Text>
              <Text>Gender: {submittedData.gender}</Text>
              <Text>
                Interests: {submittedData.interests.join(", ") || "None"}
              </Text>
              <Text>
                Terms Accepted: {submittedData.acceptTerms ? "Yes" : "No"}
              </Text>
            </BlockStack>
          </Banner>
        )}

      </BlockStack>
    </Card>
  );
}

