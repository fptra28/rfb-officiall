import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import ProfilContainer from "@/components/templates/PageContainer/Container";
import PageTemplate from "@/components/templates/PageTemplate";

interface TermItemProps {
    text: string | string[];
    terms: Record<string, string>;
    className?: string;
}

const TermItem = ({ text, terms, className = '' }: TermItemProps) => {
    if (!text) return null;

    // Create a map of replacements with their HTML-wrapped versions
    const replacements = {
        '{realtrading}': `<span class="font-medium">${terms.realtrading || 'real online trading'}</span>`,
        '{userid}': `<span class="font-medium">${terms.userid || 'User ID'}</span>`,
        '{password}': `<span class="font-medium">${terms.password || 'Password'}</span>`
    };

    const processText = (content: string) => {
        let processedText = content;
        Object.entries(replacements).forEach(([key, value]) => {
            processedText = processedText.split(key).join(value);
        });
        return processedText;
    };

    if (Array.isArray(text)) {
        return (
            <ul className="list-disc pl-5 space-y-2 mt-2">
                {text.map((item, index) => (
                    <li key={index} dangerouslySetInnerHTML={{ __html: processText(item) }} className={className} />
                ))}
            </ul>
        );
    }

    return <span dangerouslySetInnerHTML={{ __html: processText(text) }} className={className} />;
};

export default function PetunjukTransaksi() {
    const { t, ready } = useTranslation('petunjuk-transaksi');
    
    // Default values structure
    const defaultData = {
        title: 'Petunjuk Transaksi',
        intro: '',
        steps: {
            step1: '',
            step1_desc: '',
            step2: '',
            step2_desc: '',
            requirements: {
                internet: '',
                device: '',
                access: '',
                login_url: 'http://etrade.rifanberjangka.com/login.php'
            },
            step3: '',
            step3_desc: [] as string[]
        },
        terms: {
            realtrading: 'real online trading',
            userid: 'User ID',
            password: 'Password'
        }
    };
    
    // Get translations when ready
    const data = ready 
        ? {
            title: t('title'),
            intro: t('intro'),
            steps: t('steps', { returnObjects: true }) as typeof defaultData.steps,
            terms: t('terms', { returnObjects: true }) as typeof defaultData.terms
        }
        : defaultData;

    const { title, intro, steps, terms } = data;
    const requirements = steps.requirements || defaultData.steps.requirements;

    // Show loading state if translations aren't ready
    if (!ready) {
        return (
            <PageTemplate title="Loading...">
                <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
                    <ProfilContainer title="Loading...">
                        <div className="animate-pulse">Loading...</div>
                    </ProfilContainer>
                </div>
            </PageTemplate>
        );
    }

    return (
        <PageTemplate title={title}>
            <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
                <ProfilContainer title={title}>
                    <div className="space-y-8">
                        {/* Introduction */}
                        {intro && (
                            <p className="text-justify text-black">
                                <TermItem text={intro} terms={terms} />
                            </p>
                        )}

                        <ol className="space-y-8">
                            {/* Step 1 */}
                            <li className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="font-semibold text-lg text-black mb-3">
                                    1. {steps.step1}
                                </h3>
                                <p className="text-black pl-1">
                                    <TermItem text={steps.step1_desc} terms={terms} />
                                </p>
                            </li>

                            {/* Step 2 */}
                            <li className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="font-semibold text-lg text-black mb-3">
                                    2. {steps.step2}
                                </h3>
                                <p className="text-black pl-1 mb-3">
                                    <TermItem text={steps.step2_desc} terms={terms} />
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>{requirements.internet}</li>
                                    <li>{requirements.device}</li>
                                    <li>
                                        {requirements.access}
                                        <a
                                            href={requirements.login_url}
                                            className="text-green-600 hover:text-green-700 underline break-all ml-1"
                                        />
                                    </li>
                                </ul>
                            </li>

                            {/* Step 3 */}
                            <li className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="font-semibold text-lg text-black mb-3">
                                    3. {steps.step3}
                                </h3>
                                <div className="pl-1 text-black">
                                    <TermItem text={steps.step3_desc} terms={terms} />
                                </div>
                            </li>
                        </ol>
                    </div>
                </ProfilContainer>
            </div>
        </PageTemplate>
    );
}

export const getStaticProps: GetStaticProps = async ({ locale = 'id' }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            'common',
            'navbar',
            'footer',
            'petunjuk-transaksi'
        ])),
    },
});
