//#region Generic Validators

exports.validateRequiredStringField = (inputStringField) =>
    inputStringField &&
    typeof inputStringField === "string" &&
    String(inputStringField).trim() !== "";

exports.validateRequiredNumberField = (inputNumberField) =>
    inputNumberField && typeof inputNumberField === "number";

exports.validateDateTime = (inputString) =>
    this.validateRequiredStringField(inputString) &&
    !isNaN(Date.parse(inputString));

//#endregion

//#region Field Specific Validators

exports.validateEmail = (inputString) =>
    this.validateRequiredStringField(inputString) &&
    String(inputString)
        .toLowerCase()
        .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).length > 0;

exports.validatePassword = (inputString) =>
    this.validateRequiredStringField(inputString) &&
    /[A-Z]/.test(inputString) &&
    /[a-z]/.test(inputString) &&
    /[0-9]/.test(inputString) &&
    /[^A-Za-z0-9]/.test(inputString) &&
    inputString.length > 8;

exports.validateUsername = (inputString) =>
    this.validateRequiredStringField(inputString) && inputString.length > 3;

const validStatuses = ["pending", "confirmed", "rejected"];

exports.validateStatus = (inputStatusString) =>
    typeof inputStatusString === "string" &&
    validStatuses.includes(inputStatusString);

const validPricingTypes = ["Hourly", "Fixed"];

exports.validatePricingType = (inputString) =>
    this.validateRequiredStringField(inputString) &&
    typeof inputString === "string" &&
    validPricingTypes.includes(inputString);

exports.validateBookingDate = (inputDateString) =>
    this.validateDateTime(inputDateString) &&
    Date.parse(inputDateString) > Date.now();

exports.validateTraderRating = (inputNumber) =>
    this.validateRequiredNumberField(inputNumber) &&
    Number(inputNumber) > 0 &&
    Number(inputNumber) <= 5;

//#endregion
