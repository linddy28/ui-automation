# language: en
@login
Feature: User login
  As a user of the Material Login Example app
  I want to sign in with my credentials
  So that I can access the application

  Background:
    Given the app is launched on the login screen

  @login @smoke
  Scenario: Login form shows the expected controls
    Then I should see the email field
    And I should see the login button

  @login
  Scenario Outline: A user submits the login form
    When I login with email "<email>" and password "<password>"
    Then the login button should still be present
    And the login screen should remain interactive

    Examples:
      | email                | password   |
      | testuser@banco.com   | Password1! |
      | another@banco.com    | Secret123  |

  @login @navigation
  Scenario: Navigate from login to signup
    When I tap the signup link
    Then I should see the signup form
    And I should see the signup button
