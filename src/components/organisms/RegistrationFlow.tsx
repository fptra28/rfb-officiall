import { useTranslation } from "next-i18next";

interface RegolTranslations {
  steps: {
    [key: string]: string | string[];
  };
  bank_accounts: {
    [key: string]: string;
  };
}

export default function RegistrationFlow() {
  const { t } = useTranslation(["regol", "common"]);
  const tRegol = t as (
    key: string,
    options?: any
  ) => string | string[] | RegolTranslations;

  const steps = [
    {
      title: t("steps.website"),
      description: t("steps.website_desc"),
    },
    {
      title: t("steps.demo"),
      description: (
        <ul className="list-disc ml-5 space-y-1">
          {(() => {
            const demoItems = tRegol("steps.demo_items", {
              returnObjects: true,
            });
            return Array.isArray(demoItems)
              ? demoItems.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))
              : null;
          })()}
        </ul>
      ),
    },
    {
      title: t("steps.documents"),
      description: (
        <>
          <p className="mb-2">{t("steps.documents_desc")}</p>
          <ul className="list-disc ml-5 space-y-1">
            {(() => {
              const documentsItems = tRegol("steps.documents_items", {
                returnObjects: true,
              });
              return Array.isArray(documentsItems)
                ? documentsItems.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))
                : null;
            })()}
          </ul>
        </>
      ),
    },
    {
      title: t("steps.verification"),
      description: t("steps.verification_desc"),
    },
    {
      title: t("steps.deposit"),
      description: (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          <div>
            <p className="font-semibold">{t("bank_accounts.bca")}</p>
            <p>{t("bank_accounts.idr")}: 035 – 311 – 8975</p>
            <p>{t("bank_accounts.usd")}: 035 – 311 – 7600</p>
          </div>
          <div>
            <p className="font-semibold">{t("bank_accounts.cimb")}</p>
            <p>{t("bank_accounts.idr")}: 800 – 12 – 97271 – 00</p>
            <p>{t("bank_accounts.usd")}: 800 – 01 – 20945 – 40</p>
          </div>
          <div>
            <p className="font-semibold">{t("bank_accounts.bni")}</p>
            <p>{t("bank_accounts.idr")}: 017 – 5008 – 590</p>
            <p>{t("bank_accounts.usd")}: 017 – 5020 – 200</p>
          </div>
          <div>
            <p className="font-semibold">{t("bank_accounts.mandiri")}</p>
            <p>{t("bank_accounts.idr")}: 122 – 000 – 664 – 2881</p>
            <p>{t("bank_accounts.usd")}: 122 – 000 – 664 – 2873</p>
          </div>
          <div>
            <p className="font-semibold">{t("bank_accounts.artha")}</p>
            <p>{t("bank_accounts.idr")}: 107 – 996 – 3271</p>
          </div>
          <div>
            <p className="font-semibold">{t("bank_accounts.bri")}</p>
            <p>{t("bank_accounts.idr")}: 038201001512303</p>
          </div>
        </div>
      ),
    },
    {
      title: t("steps.processing"),
      description: t("steps.processing_desc"),
    },
    {
      title: t("steps.activation"),
      description: t("steps.activation_desc"),
    },
    {
      title: t("steps.ready"),
      description: t("steps.ready_desc"),
    },
  ];

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-10">
        {steps.map((step, index) => (
          <div
            key={index}
            className="border rounded-xl p-5 sm:p-6 hover:shadow-lg transition"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-green-700 mb-3">
              {index + 1}. {step.title}
            </h3>
            <div className="text-gray-600 text-sm sm:text-base leading-relaxed">
              {step.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
