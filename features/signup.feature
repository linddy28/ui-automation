# language: en
@signup
Feature: User registration
  As a new user
  I want to register an account
  So that I can use the application

  Background:
    Given the app is launched on the login screen
    And I navigate to the signup screen

  @signup @smoke
  Scenario: Signup form shows the expected controls
    Then I should see the name field
    And I should see the signup button

  @signup
  Scenario: Register a new user with valid data
    When I register with the following data
      | name      | address        | email                 | mobile     | password    |
      | John Test | 123 Main St    | john.test@banco.com   | 78945612   | Password1!  |
    Then the registration form should have been submitted
    And I should remain in the application
