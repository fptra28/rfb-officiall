import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import ProfilContainer from "@/components/templates/PageContainer/Container";
import PageTemplate from "@/components/templates/PageTemplate";

interface StepProps {
    text: string;
    terms: Record<string, string>;
}

const StepItem = ({ text, terms }: StepProps) => {
    // Create a map of replacements with their HTML-wrapped versions
    const replacements = {
        '{withdrawal}': `<span class="font-medium">${terms.withdrawal}</span>`,
        '{maxTime}': `<span class="font-medium">${terms.maxTime}</span>`,
        '{targetTime}': `<span class="font-medium">${terms.targetTime}</span>`,
        '{effectiveMargin}': `<span class="font-medium">${terms.effectiveMargin}</span>`,
        '{statementReport}': `<span class="italic">${terms.statementReport}</span>`
    };
    
    // Replace all placeholders with their HTML-wrapped versions
    let processedText = text;
    Object.entries(replacements).forEach(([key, value]) => {
        processedText = processedText.split(key).join(value);
    });
    
    return <span dangerouslySetInnerHTML={{ __html: processedText }} />;
};

export const getStaticProps: GetStaticProps = async ({ locale = 'id' }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            'common',
            'navbar',
            'footer',
            'penarikan'
        ])),
    },
});

export default function Penarikan() {
    const { t, i18n } = useTranslation('penarikan');
    const { t: tCommon } = useTranslation('common');

    const terms = t('terms', { returnObjects: true }) as any;
    const steps = t('steps', { returnObjects: true }) as any;

    return (
        <PageTemplate title={tCommon('prosedur.penarikan')}>
            <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
                <ProfilContainer title={t('title')}>
                    <div className="space-y-6">
                        <p className="text-justify text-black">
                            <StepItem 
                                text={t('intro')} 
                                terms={terms} 
                            />
                        </p>

                        <ol className="space-y-6">
                            {[1, 2, 3, 4, 5, 6].map((step) => (
                                <li key={step} className="bg-white p-4 rounded-lg shadow-sm">
                                    <h3 className="font-semibold text-lg text-black mb-2">
                                        {step}. {steps[`step${step}`]}
                                    </h3>
                                    <p className="text-black pl-4">
                                        <StepItem text={steps[`step${step}_desc`]} terms={terms} />
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </ProfilContainer>
            </div>
        </PageTemplate>
    );
}


