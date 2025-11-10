'use client';

import {
  Button,
  Card,
  Carousel,
  Dialog,
  DisplayText,
  Divider,
  Flex,
  Header,
  Heading,
  IconButton,
  OtpInput,
  ScrollArea,
  Switch,
  Text,
  TextField,
  ToggleGroup,
  colors,
} from "@hdfclife-insurance/one-x-ui";
import {
  CaretLeft,
  Certificate,
  Check,
  IconProps,
  IdentificationCard,
  Storefront,
} from "@phosphor-icons/react";
import { useRouter } from 'next/navigation';
import * as React from "react";
import { useEffect } from "react";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import clsx from "clsx";
import classNames from "embla-carousel-class-names";

// Centralized inline placeholder images to avoid external 404s
const PLACEHOLDER_PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAwCAQAAABpl0S1AAAAKUlEQVR42u3OMQ0AAAjDsOZf2cMZBkO0gSBJkiRJkiRJkiRJkiRJkr4G2B0CSH9lhrkAAAAASUVORK5CYII="; // 64x48 gray-ish

// Real remote asset URLs (restored) with fallback to placeholder on error
const IMAGES = {
  sectionImage: "https://helixassets.apps-hdfclife.com/images/landing-sample.png",
  sectionImageTwo: "https://helixassets.apps-hdfclife.com/images/landing-sample-2.png",
  quote: "https://helixassets.apps-hdfclife.com/images/quote.png",
  testimonial1: "https://helixassets.apps-hdfclife.com/images/testimonial-1.png",
  whatsapp: "https://helixassets.apps-hdfclife.com/images/whatsapp.png",
  buyingProcess: "https://helixassets.apps-hdfclife.com/images/icons/buying-process.png",
  guaranteedIncome: "https://helixassets.apps-hdfclife.com/images/icons/guaranteed-income.png",
  taxExemption: "https://helixassets.apps-hdfclife.com/images/icons/tax-exemption.png",
};

// Advisor banner remote asset
const ADVISOR_BANNER = "https://helixassets.apps-hdfclife.com/images/AdvisorBannerv2.png";

// Safe image component with fallback
const SafeImg: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({ onError, onLoad, ...rest }) => (
  <img
    {...rest}
    onLoad={(e) => {
      // Debug log for successful load
      console.debug('[SafeImg] loaded:', e.currentTarget.src);
      onLoad && onLoad(e);
    }}
    onError={(e) => {
      console.warn('[SafeImg] error loading:', e.currentTarget.src);
      if (e.currentTarget.src !== PLACEHOLDER_PNG) {
        e.currentTarget.src = PLACEHOLDER_PNG;
      }
      onError && onError(e);
    }}
  />
);

export default function LandingPage() {
  const isDesktop = useIsDesktop();
  const [dialog, setDialog] = React.useState(false);
  const [toggle, setToggle] = React.useState(1);
  const router = useRouter();

  useEffect(() => {
    let redirectTimer: NodeJS.Timeout;

    if (toggle === 3) {
      redirectTimer = setTimeout(() => {
        router.push("/template/calculate-reinvestment");
      }, 2000);
    }

    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [toggle, router]);

  const steps = [
    {
      icon: "https://helixassets.apps-hdfclife.com/static-visual-icons/Download Document_icon.svg",
      title: "Choose your reinvestment policy",
    },
    {
      icon: "https://helixassets.apps-hdfclife.com/static-visual-icons/Individual Cover_Icon.svg",
      title: "Validate your personal and nominee info",
    },
    {
      icon: "https://helixassets.apps-hdfclife.com/static-visual-icons/Secure Money_Icon.svg",
      title: "Complete your purchase",
    },
  ];

  const featuresCarouselData = [
    { title: "Tax exemption", icon: IMAGES.taxExemption },
    { title: "Quick and easy policy buying process", icon: IMAGES.buyingProcess },
    { title: "100% guaranteed income", icon: IMAGES.guaranteedIncome },
    { title: "Tax exemption", icon: IMAGES.taxExemption },
    { title: "Quick and easy policy buying process", icon: IMAGES.buyingProcess },
    { title: "100% guaranteed income", icon: IMAGES.guaranteedIncome },
  ];

  const ICON_PROPS: IconProps = {
    size: 25,
  };

  const features = [
    {
      icon: <Storefront {...ICON_PROPS} />,
      title: "Wide range of best in class plans",
    },
    {
      icon: <IdentificationCard {...ICON_PROPS} />,
      title: "24X7 robust customer care service",
    },
    {
      icon: <Certificate {...ICON_PROPS} />,
      title: "Claim settlement ratio of 99.07%",
    },
  ];

  const testomonialData = [
    { img: IMAGES.testimonial1, desc: " Mr. and Mrs. Mishra reinvested their money so they can enjoy a peaceful retirement", title: "Rahul Mishra", department: "Marketing Manager" },
    { img: IMAGES.testimonial1, desc: " Mr. and Mrs. Mishra reinvested their money so they can enjoy a peaceful retirement", title: "Vipin Mishra", department: "Tech Manager" },
    { img: IMAGES.testimonial1, desc: " Mr. and Mrs. Mishra reinvested their money so they can enjoy a peaceful retirement", title: "Rahul Mishra", department: "Marketing Manager" },
  ];

  const data = [
    "Get tax exemption",
    "Get 100% guaranteed income",
    "Easy policy buying process",
  ];

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <Header>
        <Header.Logo />
      </Header>
      <main className="flex-1 ">
        <section className=" pt-10 pb-[160px] lg:py-20">
          <div className="container flex lg:flex-row flex-col  justify-between items-center gap-10">
            <div className="space-y-10 flex-1">
              <div className="space-y-3">
                <Text>Welcome, Mr. Sumeet Shivakumar Sharma</Text>
                <DisplayText
                  fontWeight="bold"
                  size="xl"
                  className="text-3xl lg:text-5xl"
                >
                  Secure Higher Returns by Reinvesting Now
                </DisplayText>
              </div>
              <div className="max-w-md space-y-7">
                <Card>
                  <Flex justify="space-between" align="center">
                    <div className="flex-1 space-y-4">
                      <Text size="lg" className="text-gray-700">
                        Maturing policy details
                      </Text>
                      <div className="space-y-1">
                        <Heading as="h4" fontWeight="semibold">
                          <span className="text-primary-red">HDFC Life</span>{" "}
                          <span className="text-primary-blue">
                            Saral Jeevan
                          </span>
                        </Heading>
                        <Text size="md" className="text-gray-700">
                          Policy No.: 10862502
                        </Text>
                      </div>
                    </div>
                    <SafeImg
                      src="https://helixassets.apps-hdfclife.com/animated-icons/file-1.gif"
                      alt="File animation"
                      className="w-20"
                    />
                  </Flex>
                  <Card.Section className="py-3 px-5 bg-blue-25">
                    <Flex gap={16}>
                      <div className="flex-1 space-y-1">
                        <Text size="md" className="text-gray-900">
                          Maturity date
                        </Text>
                        <Text
                          size="xl"
                          fontWeight="bold"
                          className="text-gray-950"
                        >
                          01/01/2024
                        </Text>
                      </div>
                      <div className="flex-1 space-y-1">
                        <Text size="md" className="text-gray-900">
                          Maturity amount
                        </Text>
                        <Text
                          size="xl"
                          fontWeight="bold"
                          className="text-gray-950"
                        >
                          10,00,000
                        </Text>
                      </div>
                    </Flex>
                  </Card.Section>
                </Card>
                <Button fullWidth size="lg" onClick={() => setDialog(true)}>
                  Calculate Reinvestment
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative flex lg:pb-2.5 items-center">
                <SafeImg
                  src={IMAGES.sectionImage}
                  className="lg:w-[700px] w-full mx-auto relative"
                  alt="Primary visual"
                />
                <div className=" absolute -bottom-32 lg:-bottom-8 lg:max-w-lg mx-auto max-w-full">
                  <Carousel
                    slidesPerView={isDesktop ? 3 : 2}
                    loop
                    slideGap={isDesktop ? 16 : 12}
                    withIndicators={true}
                    indicatorVariant={"dot"}
                    align="start"
                    className=""
                  >
                    {featuresCarouselData.map((item, index) => (
                      <Carousel.Item key={index}>
                        <Card
                          className={clsx("h-full items-center")}
                          classNames={{
                            content: "p-3 lg:p-5",
                          }}
                        >
                          <SafeImg
                            src={item.icon}
                            className="w-16 h-16 object-contain mx-auto"
                            alt={item.title}
                          />
                          <Text
                            fontWeight="bold"
                            size="md"
                            className="text-center"
                          >
                            {item.title}
                          </Text>
                        </Card>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-blue-50 py-12">
          <div className="container">
            <Heading as="h1" fontWeight="semibold">
              Steps to reinvest
            </Heading>

            <div className="mt-8 flex gap-8 flex-col lg:flex-row">
              <div className="flex flex-1 lg:flex-row flex-col gap-4 lg:gap-0">
                {steps.map((step, index) => (
                  <React.Fragment key={index}>
                    <div className="flex items-center  lg:items-start  lg:flex-col flex-row gap-4 lg:px-6 px-2 lg:first:ps-0 lg:last:pe-0">
                      <SafeImg
                        src={step.icon}
                        className="lg:w-20 lg:h-20 w-16 h-16 object-contain"
                        alt={step.title}
                      />
                      <Text size="xl" className="text-gray-800">
                        {step.title}
                      </Text>
                    </div>
                    {index < steps.length - 1 && (
                      <Divider orientation="vertical" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="lg:w-60 lg:space-y-8 space-y-4">
                <Heading
                  as="h3"
                  fontWeight="semibold"
                  className="hidden lg:block"
                >
                  New policy quickly in just 3 steps.
                </Heading>
                <Text
                  className="lg:hidden block"
                  size="xl"
                  fontWeight="semibold"
                >
                  New policy quickly in just 3 steps.
                </Text>
                <Button onClick={() => setDialog(true)}>
                  Calculate Reinvestment
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Desktop Only */}
        <section className="bg-white">
          <div className="container items-center justify-between py-10 hidden lg:flex">
            <img
              src={IMAGES.sectionImageTwo}
              className="max-w-md mx-auto flex-1"
              alt="Secondary visual"
            />
            <div className="flex-1 space-y-14">
              <div className="space-y-2 ">
                <Heading fontWeight="semibold">
                  Why you should consider HDFC Life
                </Heading>
                <Text>
                  We are always ready to help by providing the best service in
                  the market for you.
                </Text>
              </div>

              <div className="space-y-7">
                {features.map((item) => (
                  <div className="inline-flex gap-4 items-center" key={(item as any).title}>
                    <div className="size-16 flex justify-center items-center bg-primary-red rounded-full text-white">
                      {item.icon}
                    </div>
                    <Heading as="h4" fontWeight="regular">
                      {item.title}
                    </Heading>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Only */}
          <div className="container flex items-center justify-between py-10 lg:hidden">
            <div className="flex-1 space-y-14">
              <div className="space-y-2 ">
                <Heading as="h4" fontWeight="semibold">
                  Why you should consider HDFC Life
                </Heading>

                <Flex gap={16} align="center">
                  <SafeImg src={IMAGES.sectionImageTwo} className="w-[100px]" alt="Secondary visual mobile" />
                  <Text>
                    We are always ready to help by providing the best service in
                    the market for you.
                  </Text>
                </Flex>
              </div>

              <div className="space-y-7">
                {features.map((item) => (
                  <div className="flex gap-4 items-center" key={(item as any).title}>
                    <div className="lg:size-16 size-10 flex justify-center items-center bg-primary-red rounded-full text-white">
                      {item.icon}
                    </div>
                    <Text size="md" fontWeight="regular">
                      {item.title}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="lg:py-14 py-0">
          <div className="container">
            <div className="bg-blue-50 overflow-hidden lg:relative rounded-xl lg:p-10 flex lg:flex-row flex-col">
              <div className="max-w-xl p-6">
                <Heading
                  as="h2"
                  fontWeight="semibold"
                  className="hidden lg:block"
                >
                  Talk to an advisor right away
                </Heading>
                <Text
                  className="lg:hidden block"
                  size="xl"
                  fontWeight="semibold"
                >
                  Talk to an advisor right away
                </Text>
                <Text className="text-gray-700 mt-1">
                  We help you to choose best insurance plan based on your needs
                </Text>

                <Button variant="secondary" className="mt-8">
                  Schedule a Call
                </Button>
              </div>

              <div className="hidden lg:block bg-blue-200 size-[500px] rounded-full lg:absolute lg:right-0 lg:top-0 lg:-translate-y-1/3 lg:translate-x-10" />
              <SafeImg
                src={ADVISOR_BANNER}
                alt="Advisor Banner"
                className="lg:absolute lg:right-0 lg:bottom-0 w-[400px]"
              />
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="container space-y-8">
            <Heading as="h1" fontWeight="semibold">
              We have stories that will inspire you
            </Heading>
            <Carousel
              slidesPerView={isDesktop ? 1.2 : 1}
              loop
              // slideGap={18}
              withIndicators={false}
              align="start"
              plugins={[
                classNames({
                  snapped: "snapped",
                  inView: "inView",
                }),
              ]}
            >
              {testomonialData.map((item, index) => (
                <Carousel.Item key={index}>
                  <div className="flex lg:gap-24 gap-6">
                    <div className="relative shrink-0">
                      <SafeImg
                        src={item.img}
                        className="lg:size-60 rounded-full"
                        alt={item.title}
                      />
                      <div className="absolute top-0 translate-y-1/2 transform  lg:-right-[40px]  -right-[10px] ">
                        <SafeImg
                          src={IMAGES.quote}
                          className={clsx(!isDesktop && "w-6 h-6")}
                          alt="Quote mark"
                        />
                      </div>
                    </div>

                    <div className="relative space-y-8">
                      <Heading
                        as="h4"
                        fontWeight="regular"
                        className="max-w-2xl"
                      >
                        {item.desc}
                      </Heading>

                      <div>
                        <Heading fontWeight="semibold">{item.title}</Heading>
                        <Text>{item.department}</Text>
                      </div>
                    </div>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        </section>

        <div className="bg-gray-100 py-10">
          <div className="container space-y-4">
            <Text fontWeight="bold" size="xl">
              Terms & Conditions
            </Text>
            <ScrollArea className="max-h-[300px]">
              <Text className="text-gray-600" size="sm">
                Declaration of the Life(s) to be Assured and Proposer / Policy
                Owner: I/We declare that: i. I/We have replied to the questions,
                and have made the statements in respect of the matters sought
                for, in the proposal Form/Electronic proposal form ("Proposal
                Form") and I understand and agree that the replies given and
                statements/declarations made in the Proposal Form together with
                any documents submitted by me/us for processing my/our
                application for insurance shall be the basis of the contract
                between me/us and HDFC Life Insurance Company Limited ("the
                Company").
              </Text>
            </ScrollArea>
          </div>
        </div>

        <Dialog
          open={dialog}
          classNames={{
            backdrop: "bg-slate-500/80",
          }}
          onOpenChange={(details) => {
            setDialog(details.open);
            setToggle(1);
          }}
          scroll="body"
          size="xl"
          padding="none"
        >
          <div className="grid lg:grid-cols-[1fr_1.5fr]">
            <div className="hidden lg:block shadow-md relative min-h-[450px]">
              <Flex direction="column" gap={12} className="p-10">
                <Heading as="h4" fontWeight="semibold">
                  Your policy is maturing Soon!
                </Heading>
                <div className="space-y-4">
                  {data.map((item, index) => (
                    <Flex gap={16} align="center" key={index}>
                      <Check color={colors.secondary.blue[500]} />
                      <Text>{item}</Text>
                    </Flex>
                  ))}
                </div>
                <div className="absolute bottom-0">
                  <SafeImg
                    src={"https://helixassets.apps-hdfclife.com/images/Family2.png"}
                    alt="Family illustration"
                    className="w-[300px]"
                  />
                </div>
              </Flex>
            </div>

            <div
              className={clsx(
                "lg:p-10 p-3",
                toggle === 3 && "flex items-center",
              )}
            >
              {toggle === 1 ? (
                <div className="flex flex-col gap-7 ">
                  <Heading fontWeight="semibold">
                    Authenticate to Reinvest
                  </Heading>
                  <div className="space-y-2.5">
                    <Text>Please choose a method for verification.</Text>
                    <div>
                      <ToggleGroup
                        data={[
                          {
                            label: "Mobile Number",
                            value: "mobile",
                          },
                          {
                            label: "Policy Number",
                            value: "policy",
                          },
                          {
                            label: "PAN Number",
                            value: "pan",
                          },
                        ]}
                        size={isDesktop ? "md" : "sm"}
                      ></ToggleGroup>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <TextField
                      label="Mobile No."
                      placeholder="XXXXXXXXXX"
                      variant="underline"
                    />
                    <Button fullWidth onClick={() => setToggle(2)}>
                      Get OTP
                    </Button>
                  </div>
                  <Flex gap={8} justify="space-between">
                    <Flex gap={8} align="center">
                      <SafeImg src={IMAGES.whatsapp} alt="WhatsApp" className="w-10" />
                      <Text size="sm">
                        Send messages and notifications on whatsapp
                      </Text>
                    </Flex>
                    <Switch />
                  </Flex>
                </div>
              ) : toggle === 2 ? (
                <div className="flex flex-col gap-7">
                  <Flex align="center" gap={8}>
                    <IconButton
                      onClick={() => setToggle(1)}
                      variant="link"
                      className="-ml-[10px]"
                    >
                      <CaretLeft />
                    </IconButton>
                    <Heading fontWeight="semibold">Verify OTP</Heading>
                  </Flex>
                  <div className="space-y-2.5">
                    <Flex>
                      <Text>
                        An OTP has been sent to your registered mobile number
                        +91 XXXX XXX XXX
                      </Text>
                    </Flex>
                    <div className="space-y-5">
                      <OtpInput
                        label="Enter OTP"
                        maxRetries={3}
                        withTimer
                        endingTimer={60}
                      />
                      <Button fullWidth onClick={() => setToggle(3)}>
                        Verify
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <Flex align="center" justify="center" direction="column">
                  <Flex justify="center" gap={8} direction="column">
                    <SafeImg
                      src="https://helixassets.apps-hdfclife.com/animated-icons/successfull.gif"
                      className="size-28 mx-auto object-contain"
                      alt="Success"
                    />
                    <Heading as="h3" fontWeight="semibold">
                      Verification completed successfully!
                    </Heading>
                    <Text>
                      You're all set to reinvest the funds from your matured
                      policy.
                    </Text>
                  </Flex>
                </Flex>
              )}
            </div>
          </div>
        </Dialog>
      </main>
    </div>
  );
}
