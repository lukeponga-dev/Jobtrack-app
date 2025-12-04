
import { getResumeFeedback, ResumeFeedbackInput } from './resume-feedback';
import { ai } from '../genkit';
import * as assert from 'assert';
import * as process from 'process';

// Store original functions
const originalDefineFlow = ai.defineFlow;
const originalDefinePrompt = ai.definePrompt;

async function runTests() {
    console.log('Starting resume feedback tests...');

    try {
        await testSuccess();
        await testFailure();
        await testEmptyResumeFallback();

        console.log('All resume feedback tests passed!');
    } catch (err) {
        console.error("Tests failed!", err);
        process.exit(1);
    } finally {
        cleanup();
    }
}

async function testSuccess() {
    console.log('Running test: testSuccess...');
    const mockInput: ResumeFeedbackInput = {
        resumeDataUri: 'data:application/pdf;base64,JVBERi0xLjcK...',
        resumeText: 'This is a sample resume text with experience and skills.',
    };

    const mockOutput = {
        overallScore: 85,
        suggestions: ['Great resume!', 'Add more projects.'],
        keywordOptimizations: ['React', 'Node.js'],
    };

    // Mock the prompt to return a successful output
    ai.definePrompt = (() => async () => ({ output: mockOutput })) as any;
    ai.defineFlow = ((config: any, handler: any) => handler) as any;


    const result = await getResumeFeedback(mockInput);

    assert.deepStrictEqual(result, mockOutput, 'Test Success: Output should match mock');
    console.log('testSuccess passed.');
}

async function testFailure() {
    console.log('Running test: testFailure...');
    const mockInput: ResumeFeedbackInput = {
        resumeDataUri: 'data:application/pdf;base64,JVBERi0xLjcK...',
        resumeText: 'This is a sample resume text with experience and skills.',
    };

    // Mock the prompt to throw an error
    ai.definePrompt = (() => async () => { throw new Error('AI API Error') }) as any;
    ai.defineFlow = ((config: any, handler: any) => handler) as any;

    const result = await getResumeFeedback(mockInput);

    assert.ok(result.overallScore >= 0 && result.overallScore <= 100, 'Test Failure: Score should be in range');
    assert.ok(result.suggestions.includes('The AI model could not be reached, but we performed a basic analysis.'), 'Test Failure: Should contain fallback suggestion');
    assert.deepStrictEqual(result.keywordOptimizations, ['AI analysis unavailable'], 'Test Failure: Should contain fallback keyword optimization');
    console.log('testFailure passed.');
}

async function testEmptyResumeFallback() {
    console.log('Running test: testEmptyResumeFallback...');
    const mockInput: ResumeFeedbackInput = {
        resumeDataUri: 'data:application/pdf;base64,JVBERi0xLjcK...',
        resumeText: '',
    };
    // Mock the prompt to throw an error
    ai.definePrompt = (() => async () => { throw new Error('AI API Error') }) as any;
    ai.defineFlow = ((config: any, handler: any) => handler) as any;


    const result = await getResumeFeedback(mockInput);

    assert.strictEqual(result.overallScore, 30, 'Test Empty Fallback: Score should be 30 for empty resume');
    assert.ok(result.suggestions.includes('Résumé content was empty or unavailable.'), 'Test Empty Fallback: Should have suggestion for empty resume');
    console.log('testEmptyResumeFallback passed.');
}

// Restore original functions after all tests are done
function cleanup() {
    ai.defineFlow = originalDefineFlow;
    ai.definePrompt = originalDefinePrompt;
}

runTests();
