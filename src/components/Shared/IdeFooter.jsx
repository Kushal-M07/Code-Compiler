import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RunIcon } from '../../modules/course-lms-v2/components/shared/assets/svg';
import { courseSelectedSelector } from '../../redux/courseSlice';
import CompleteAssesmentModal from '../modal/completedActivityModal/completeAssesmentModal';
import HTMLIdeInterface from './html_interface';
import SqlSubmission from './sqlInterface';
import {
    langSelector,
    fetchDataForPracticeTab,
    handleTestWebEngageEventPractice,
    handleRunWebengageEventPractice,
    handleSubmitWebEngageEventPractice,
} from './ideFunctions';
import { runProblem, submitCode, testProblem } from '../../services/problemsApiService';
import { UserInputTab, MainTabsSelection, RunCodeTab, SubmitTestCodeResult } from './tabs';
import { setUpdateSubmissions } from '../../redux/problemsSlice';
import { javascriptHiddenCode } from 'src/modules/course-lms-v2/components/shared/utils';
import './style.css';

const commonButtonClass =
    'px-4 py-1 rounded ring-2 ring-learn-primary text-learn-primary cursor-pointer';

function IdeFooter({
    isSQLCode,
    isHtmlCode,
    selectedProblem,
    codingAssessmentBool,
    codingAssessmentProblemList,
    assessmentName,
}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [showOutput, setShowOutput] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [activeTab, setActiveTab] = useState(1);
    const [userInputText, setUserInputText] = useState('');
    const [runCodeResult, setRunCodeResult] = useState(null);

    const courseSelected = useSelector(courseSelectedSelector);
    const problemSlice = useSelector((state) => state.problemReducer);
    const {
        code: problemCode,
        currentSelectedCodingLanguage: codingLanguage,
        currentSelectedProblem,
        headerIcon,
    } = problemSlice;

    const isResetAction = headerIcon.reset;
    const writtenCode =
        codingLanguage === 'javascript'
            ? javascriptHiddenCode + problemCode?.[codingLanguage]
            : problemCode?.[codingLanguage];

    // reset states
    useEffect(() => {
        setActiveTab(0);
        setShowOutput(false);
        if (!isSQLCode) {
            setRunCodeResult(null);
        }
        setUserInputText('');
    }, [currentSelectedProblem, isResetAction]);

    const handleRunCode = async () => {
        if (!isSQLCode) {
            setActiveTab(2);
            setRunCodeResult({ type: 'run_code', codeRunning: true });
            setShowOutput(true);
            const lang = langSelector(codingLanguage);
            try {
                const result = await runProblem(writtenCode, lang, userInputText);
                setRunCodeResult({ type: 'run_code', result });
                handleRunWebengageEventPractice(courseSelected, selectedProblem, codingAssessmentBool);
            } catch (error) {
                console.error(error);
                setRunCodeResult({ type: 'run_code', error: true });
            } finally {
                setRunCodeResult((prev) => ({ ...prev, codeRunning: false }));
            }
        } else {
            setShowOutput(true);
            setActiveTab(1);
            setRunCodeResult((prev) => ({ ...prev, type: 'sql', runQuery: true }));
        }
    };

    const handleTestCode = async () => {
        setActiveTab(isSQLCode ? 0 : 1);
        setRunCodeResult({ type: 'test_code', testingCode: true });
        setShowOutput(true);
        const lang = langSelector(codingLanguage);
        try {
            const { result } = await testProblem(
                writtenCode,
                selectedProblem?.attributes?.problem_code?.se_id,
                lang
            );
            setRunCodeResult({ type: 'test_code', result });
            handleTestWebEngageEventPractice(
                courseSelected,
                selectedProblem,
                codingAssessmentBool,
                result
            );
        } catch (error) {
            console.error(error);
            setRunCodeResult({
                type: 'test_code',
                error: 'Error: Some Error occured, Please try again!',
            });
        } finally {
            setRunCodeResult((prev) => ({ ...prev, testingCode: false }));
        }
    };

    const handleSubmitCode = async () => {
        setActiveTab(isSQLCode ? 0 : 1);
        setRunCodeResult({ type: 'test_code', testingCode: true });
        setShowOutput(true);
        try {
            const lang = langSelector(codingLanguage);
            const result = await submitCode(
                writtenCode,
                selectedProblem?.id,
                selectedProblem?.attributes?.problem_code?.se_id,
                lang
            );
            fetchDataForPracticeTab(dispatch, setShowPopup, codingAssessmentProblemList);
            setRunCodeResult({ type: 'test_code', result });
            dispatch(setUpdateSubmissions(true));
            handleSubmitWebEngageEventPractice(
                courseSelected,
                selectedProblem,
                codingAssessmentBool,
                result
            );
        } catch (error) {
            console.error(error, 'error');
            setRunCodeResult({ type: 'test_code', error: 'Error: Code submission failed.' });
        } finally {
            setRunCodeResult((prev) => ({ ...prev, testingCode: false }));
        }
    };

    return (
        <div className='sticky bottom-0 z-10 border border-solid border-gray-dark md:border-0 border-t-0'>
            <div className='flex justify-between items-center bg-gray-c15 text-base font-bold p-3 h-16 cursor-pointer overflow-y-scroll'>
                {/* main outline for IDE : console */}
                <div
                    className='text-learn-primary flex items-center text-sm relative'
                    onClick={() => setShowOutput(!showOutput)}
                >
                    <p>Console</p>
                    <div
                        className={`px-2 py-0.5 absolute  ${showOutput ? 'transform rotate-180 left-16' : 'left-14'
                            }`}
                    >
                        <div className='ide-arrow ide-arrow-first' />
                        <div className='ide-arrow ide-arrow-second' />
                    </div>
                </div>
                <div className='sticky bottom-0 z-10 border border-solid border-gray-dark md:border-0 border-t-0'>
                    {showPopup && (
                        <CompleteAssesmentModal
                            showModal={showPopup}
                            setShowModal={setShowPopup}
                            action={() => {
                                history.push(
                                    `/${courseSelected}/practice/${codingAssessmentBool ? 'coding-assessments' : 'coding-problems'
                                    }`
                                );
                            }}
                            data={assessmentName}
                        />
                    )}

                    {/* buttons for run, test and submit */}
                    {(!isHtmlCode || isSQLCode) && (
                        <div className='flex gap-3'>
                            <div
                                className='px-4 py-1 rounded bg-learn-primary text-white cursor-pointer flex items-center gap-2'
                                onClick={handleRunCode}
                            >
                                <RunIcon />
                                {!isSQLCode ? 'Run code' : 'Run Query'}
                            </div>

                            {selectedProblem?.attributes?.problem_code?.se_id && (
                                <>
                                    <div className={commonButtonClass} onClick={() => handleTestCode()}>
                                        Run Tests
                                    </div>
                                    <div className={commonButtonClass} onClick={() => handleSubmitCode()}>
                                        Submit
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                    {isHtmlCode && <HTMLIdeInterface showOutput={showOutput} problemCode={problemCode} />}
                </div>
            </div>

            {/* result interface */}
            {!isHtmlCode && !isSQLCode ? (
                <div
                    className='z-1 overflow-y-auto text-justify break-all bg-white'
                    style={{
                        height: showOutput ? '40vh' : '0',
                    }}
                >
                    {/* tabs for result interface */}
                    <MainTabsSelection
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        selectedProblem={selectedProblem}
                    />
                    <hr />

                    {/* main result interface */}
                    {/* tab - 0 : for taking input from user */}
                    {activeTab === 0 && (
                        <UserInputTab userInputText={userInputText} setUserInputText={setUserInputText} />
                    )}

                    {/* tab - 1: for test cases and submit result */}
                    {activeTab === 1 && <SubmitTestCodeResult runCodeResult={runCodeResult} />}

                    {/* tab - 3: for output */}
                    {activeTab === 2 && <RunCodeTab runCodeResult={runCodeResult} />}
                </div>
            ) : (
                <SqlSubmission
                    selectedProblem={selectedProblem}
                    runCodeResult={runCodeResult}
                    setRunCodeResult={setRunCodeResult}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    problemCode={problemCode}
                    codingLanguage={codingLanguage}
                    isResetAction={isResetAction}
                    showOutput={showOutput}
                    setShowOutput={setShowOutput}
                />
            )}
        </div>
    );
}

export default IdeFooter;