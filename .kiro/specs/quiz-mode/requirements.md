# Requirements Document

## Introduction

Quiz Mode adds an interactive quiz experience to the Kids Image Flashcards app. The child sees a word displayed prominently at the top of the screen and selects the correct matching image from a grid of 3–4 image options. This word-to-image approach reinforces visual association and recognition for a non-verbal child who interacts via tapping.

## Glossary

- **App**: The Kids Image Flashcards React application
- **Quiz_Engine**: The module responsible for generating quiz questions, managing answer choices, and evaluating responses
- **Quiz_View**: The UI component that displays the quiz question word and the image answer options
- **Flashcard**: A data object containing an id, name, imageSrc, and category
- **Category**: A classification label for flashcards (e.g., Fruits, Animals, Colors)
- **Prompt_Word**: The flashcard name displayed as text at the top of the quiz screen; the child must find the image that matches this word
- **Question**: A single quiz item consisting of a Prompt_Word and a set of image-based Answer_Options
- **Answer_Options**: A set of tappable images presented to the child in a grid layout, containing exactly one correct image and multiple Distractors
- **Distractor**: An incorrect image option drawn from a different flashcard within the same Category as the correct answer
- **Session**: A continuous sequence of quiz questions from activation to exit
- **Feedback_Indicator**: A visual and optional audio cue shown after the child selects an answer

## Requirements

### Requirement 1: Quiz Mode Activation

**User Story:** As a parent, I want to activate quiz mode with a button, so that my child can practice recognizing items from the flashcards.

#### Acceptance Criteria

1. THE App SHALL display a quiz mode toggle button in the footer area alongside the existing play/pause control.
2. WHEN the quiz mode button is tapped, THE App SHALL transition from flashcard browsing mode to quiz mode.
3. WHEN quiz mode is active, THE App SHALL hide the flashcard browsing controls (play/pause, swipe navigation).
4. WHEN the quiz mode exit button is tapped, THE App SHALL return to flashcard browsing mode and restore all browsing controls.

### Requirement 2: Quiz Question Generation

**User Story:** As a parent, I want quiz questions generated from the current category, so that my child is tested on relevant content.

#### Acceptance Criteria

1. WHEN quiz mode is activated, THE Quiz_Engine SHALL generate a Question by selecting a random Flashcard from the currently filtered set as the correct answer and using its name as the Prompt_Word.
2. THE Quiz_Engine SHALL produce exactly 4 image-based Answer_Options per Question: 1 correct image and 3 Distractor images.
3. THE Quiz_Engine SHALL select Distractor images from flashcards within the same Category as the correct answer, each representing a different item name.
4. IF the current Category contains fewer than 4 unique flashcard names, THEN THE Quiz_Engine SHALL draw additional Distractor images from other categories to fill the 4 Answer_Options.
5. THE Quiz_Engine SHALL randomize the position of the correct image among the Answer_Options for each Question.
6. THE Quiz_Engine SHALL use unique flashcard names for all 4 Answer_Options within a single Question (no duplicate names or images).

### Requirement 3: Quiz Display

**User Story:** As a parent, I want the quiz to show a word at the top and image choices below, so that my non-verbal child can associate words with pictures independently.

#### Acceptance Criteria

1. THE Quiz_View SHALL display the Prompt_Word prominently at the top of the screen in a font size of 36px or larger.
2. THE Quiz_View SHALL display the 4 Answer_Options as tappable images arranged in a 2x2 grid layout below the Prompt_Word.
3. THE Quiz_View SHALL size each image option to a minimum tap target of 120x120 CSS pixels.
4. THE Quiz_View SHALL display each Answer_Option image with equal dimensions and consistent spacing within the grid.
5. THE Quiz_View SHALL hide the flashcard name label and browsing-mode image display that are normally shown during browsing mode.

### Requirement 4: Answer Evaluation and Feedback

**User Story:** As a parent, I want my child to receive immediate visual feedback on answers, so that learning is reinforced through positive interaction.

#### Acceptance Criteria

1. WHEN the child taps the correct image Answer_Option, THE Quiz_View SHALL highlight the selected image with a green border.
2. WHEN the child taps an incorrect image Answer_Option, THE Quiz_View SHALL highlight the selected image with a red border and highlight the correct image Answer_Option with a green border.
3. WHEN an image is selected, THE Quiz_View SHALL disable all image Answer_Options to prevent multiple selections.
4. WHEN the child taps the correct image Answer_Option, THE Feedback_Indicator SHALL display a celebratory visual (e.g., a star or checkmark animation).
5. WHEN the child taps an incorrect image Answer_Option, THE Feedback_Indicator SHALL display an encouraging visual (e.g., a "try next time" icon) without negative imagery.

### Requirement 5: Quiz Progression

**User Story:** As a parent, I want the quiz to automatically advance to the next question, so that my child stays engaged without needing help to continue.

#### Acceptance Criteria

1. WHEN the child answers a Question correctly, THE Quiz_Engine SHALL advance to the next Question after a 1500 millisecond delay.
2. WHEN the child answers a Question incorrectly, THE Quiz_Engine SHALL advance to the next Question after a 2500 millisecond delay.
3. THE Quiz_Engine SHALL select a different flashcard image for each consecutive Question within a Session (no immediate repeats).
4. WHILE quiz mode is active, THE Quiz_View SHALL display the current question number (e.g., "Question 3").

### Requirement 6: Category Filtering in Quiz Mode

**User Story:** As a parent, I want to quiz my child on a specific category, so that practice is focused on the topic we are learning.

#### Acceptance Criteria

1. WHILE quiz mode is active, THE App SHALL continue to display the Category selector.
2. WHEN a new Category is selected during quiz mode, THE Quiz_Engine SHALL restart the Session with flashcards from the newly selected Category.
3. WHEN "All" is selected as the Category during quiz mode, THE Quiz_Engine SHALL draw Questions from all available flashcards and select Distractors from the same Category as the correct answer.

### Requirement 7: Quiz Score Tracking

**User Story:** As a parent, I want to see how my child is doing during the quiz, so that I can gauge progress and celebrate achievements.

#### Acceptance Criteria

1. WHILE quiz mode is active, THE Quiz_View SHALL display a running score showing the count of correct answers out of total questions answered (e.g., "3 / 5").
2. WHEN quiz mode is exited, THE App SHALL reset the Session score.
3. WHEN a new Category is selected during quiz mode, THE Quiz_Engine SHALL reset the Session score to zero.
