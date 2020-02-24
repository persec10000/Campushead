export const TEST_CHANGE = "[TEST] CHANGE";

export function changeTest(count) {
    return {
        action: TEST_CHANGE,
        payload: count
    }
}