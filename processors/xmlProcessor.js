const xml2js = require('xml2js');

class XmlProcessor {
    constructor() {
        this.parser = new xml2js.Parser();
    }

    /**
     * Parses XML string to JSON object
     * @param {string} xmlData - XML data as string
     * @returns {Promise<object>} Parsed JSON object
     */
    async parseXmlToJson(xmlData) {
        return new Promise((resolve, reject) => {
            this.parser.parseString(xmlData, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    /**
     * Extracts contract data from XML object
     * @param {object} xmlObject - Parsed XML object
     * @param {RegExp} organizationFilter - Regex to filter organizations
     * @returns {Array} Array of extracted contract data
     */
    extractContractData(xmlObject, organizationFilter) {
        const arrayFinal = [];

        if (!xmlObject?.feed?.entry) {
            return arrayFinal;
        }

        xmlObject.feed.entry
            .filter((item) => item.summary?.[0]?._?.match(organizationFilter))
            .forEach((elem) => {
                const itemArray = this._extractBasicData(elem);
                const contractFolderStatus = elem['cac-place-ext:ContractFolderStatus']?.[0];

                if (contractFolderStatus) {
                    this._extractContractDetails(itemArray, contractFolderStatus);
                    this._extractTenderResults(itemArray, contractFolderStatus);
                }

                arrayFinal.push(itemArray);
            });

        return arrayFinal;
    }

    /**
     * Extracts basic data from entry element
     * @private
     */
    _extractBasicData(elem) {
        return {
            link: elem.link?.[0]?.$.href,
            summary: elem.summary?.[0]?._,
            title: elem.title?.[0],
            updated: elem.updated?.[0],
        };
    }

    /**
     * Extracts contract details from contract folder status
     * @private
     */
    _extractContractDetails(itemArray, contractFolderStatus) {
        itemArray.ContractFolderID = contractFolderStatus['cbc:ContractFolderID']?.[0];

        const procurementProject = contractFolderStatus['cac:ProcurementProject']?.[0];
        const tenderingProcess = contractFolderStatus['cac:TenderingProcess'];

        // Extract duration and unit code
        const plannedPeriod = procurementProject?.['cac:PlannedPeriod']?.[0];
        const durationMeasure = plannedPeriod?.['cbc:DurationMeasure']?.[0];

        itemArray.DurationMeasure = durationMeasure?._ || 'Sin dato';
        itemArray.unitCode = durationMeasure?.$.unitCode || 'Sin dato';

        // Extract contract folder status code
        itemArray.ContractFolderStatusCode =
            contractFolderStatus['cbc-place-ext:ContractFolderStatusCode']?.[0]?._ || 'Sin dato';

        // Extract procurement project details
        itemArray.Name = procurementProject?.['cbc:Name']?.[0] || 'Sin dato';
        itemArray.TypeCode = procurementProject?.['cbc:TypeCode']?.[0]?._ || 'Sin dato';
        itemArray.SubTypeCode = procurementProject?.['cbc:SubTypeCode']?.[0]?._ || 'Sin dato';

        // Extract budget amounts
        const budgetAmount = procurementProject?.['cac:BudgetAmount']?.[0];
        itemArray.TotalAmount = budgetAmount?.['cbc:TotalAmount']?.[0]?._
            ? Math.trunc(budgetAmount['cbc:TotalAmount'][0]._)
            : 'Sin dato';
        itemArray.TaxExclusiveAmount = budgetAmount?.['cbc:TaxExclusiveAmount']?.[0]?._
            ? Math.trunc(budgetAmount['cbc:TaxExclusiveAmount'][0]._)
            : 'Sin dato';

        // Extract procedure and urgency codes
        itemArray.ProcedureCode = tenderingProcess?.[0]?.['cbc:ProcedureCode']?.[0]?._ || 'Sin dato';
        itemArray.UrgencyCode = tenderingProcess?.[0]?.['cbc:UrgencyCode']?.[0]?._ || 'Sin dato';
    }

    /**
     * Extracts tender results from contract folder status
     * @private
     */
    _extractTenderResults(itemArray, contractFolderStatus) {
        const tenderResults = contractFolderStatus['cac:TenderResult'];

        if (!tenderResults) {
            return;
        }

        const arrayTenderResult = [];

        tenderResults.forEach((tenderResult) => {
            const item = this._extractSingleTenderResult(tenderResult);
            arrayTenderResult.push(item);
        });

        itemArray.arrayTenderResult = arrayTenderResult;
    }

    /**
     * Extracts data from a single tender result
     * @private
     */
    _extractSingleTenderResult(tenderResult) {
        // Extract winning party information
        const winningParty = tenderResult['cac:WinningParty']?.[0];
        const partyIdentification = winningParty?.['cac:PartyIdentification']?.[0]?.['cbc:ID']?.[0]?._ || 'Sin dato';
        const partyName = winningParty?.['cac:PartyName']?.[0]?.['cbc:Name']?.[0] || 'Sin dato';

        // Extract monetary amounts
        const legalMonetaryTotal = tenderResult['cac:AwardedTenderedProject']?.[0]?.['cac:LegalMonetaryTotal']?.[0];
        const taxExclusiveAmount = legalMonetaryTotal?.['cbc:TaxExclusiveAmount']?.[0]?._
            ? Math.trunc(legalMonetaryTotal['cbc:TaxExclusiveAmount'][0]._)
            : 'Sin dato';
        const payableAmount = legalMonetaryTotal?.['cbc:PayableAmount']?.[0]?._
            ? Math.trunc(legalMonetaryTotal['cbc:PayableAmount'][0]._)
            : 'Sin dato';

        return {
            ResultCode: tenderResult['cbc:ResultCode']?.[0]?._ || 'Sin dato',
            AwardDate: tenderResult['cbc:AwardDate']?.[0] || 'Sin dato',
            ReceivedTenderQuantity: tenderResult['cbc:ReceivedTenderQuantity']?.[0] || 'Sin dato',
            PartyIdentification: partyIdentification,
            PartyName: partyName,
            TaxExclusiveAmount: taxExclusiveAmount,
            PayableAmount: payableAmount,
        };
    }
}

module.exports = XmlProcessor;
