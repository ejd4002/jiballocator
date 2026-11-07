


// adds row to JIB calculation table
let rowCount = 0;

function JibCalcAddRow(tableID, columnIndex) {

	
	const PartnerNameValue = document.getElementById("PartnerName").value.trim();
	const GrossAmountValue = document.getElementById("GrossAmount").value.trim();
	const WorkingInterestValue = document.getElementById("WorkingInterest").value.trim();
	
	const table = document.getElementById(tableID);
	const tbody = document.querySelector("#JIBcalc tbody");
	const rows = tbody.rows;

	if (rowCount >= 1) // check gross value
		{
			const newestRow = tbody.rows[tbody.rows.length - 2];
			const newGrossAmount = newestRow.cells[1].textContent;
	
			if (parseFloat(GrossAmountValue) !== parseFloat(newGrossAmount))
				{
					alert("Gross value must be equal across entries")
					return;
				}
		}

	let existingWorkingInterest = 0; // checking working interest value equals 100%
	
	for(let i = 0; i < rows.length - 1; i++)
		{
			existingWorkingInterest += parseFloat(rows[i].cells[2].textContent) || 0;
		}
	const proposedInterestTotal = existingWorkingInterest + (parseFloat(WorkingInterestValue) || 0);

	if (proposedInterestTotal > 1 + 1e-9)
		{
			alert("Total working interest cannot be greater than 1 (100%). Your inputs would total " + proposedInterestTotal.toFixed(4));
			return;
		}

	const newRow =table.insertRow(table.rows.length - 1); // adding the input row to the table
		[PartnerNameValue, GrossAmountValue, WorkingInterestValue, GrossAmountValue * WorkingInterestValue]
			.forEach(v => {
				const cell = newRow.insertCell();
				cell.textContent = v;
			});

	const invoiceeSelect = document.getElementById("InvoiceeName"); // adds partner name to dropdown in partner info input section and partner info section
	const invoiceeSectionSelector = document.getElementById("InvoiceeSelection");
	const invoiceeSelectAlreadyListed = [...invoiceeSelect.options].some(o => o.value === PartnerNameValue);
	const invoiceSectionSelectorAlreadyListed = [...invoiceeSectionSelector.options].some(o => o.value === PartnerNameValue);

	if (PartnerNameValue && !invoiceeSelectAlreadyListed && !invoiceSectionSelectorAlreadyListed)
		{
			const option = document.createElement("option");
			option.value = PartnerNameValue;
			option.textContent = PartnerNameValue;
			invoiceeSelect.appendChild(option);
			invoiceeSectionSelector.appendChild(option.cloneNode(true));
		}

	rowCount++;

	const interestsTable = document.getElementById("interestsTable");
	const interestsRow = interestsTable.insertRow(-1);
	[PartnerNameValue, WorkingInterestValue]
		.forEach(v => 
			{
				const cell = interestsRow.insertCell();
				cell.textContent = v;
			});

	const totalsRow = rows[rows.length - 1]; // calculate totals
	let workingInterestTotal = 0;
	let netAmountTotal = 0;
	
	for(let i = 0; i < rows.length - 1; i++)
		{
			workingInterestTotal += parseFloat(rows[i].cells[2].textContent) || 0;
			netAmountTotal += parseFloat(rows[i].cells[3].textContent) || 0;
		}


	totalsRow.cells[1].textContent = GrossAmountValue;
	totalsRow.cells[2].textContent = workingInterestTotal;
	totalsRow.cells[3].textContent = netAmountTotal;

	document.getElementById("PartnerName").value = ""; //reset table input row
	document.getElementById("GrossAmount").value = "";
	document.getElementById("WorkingInterest").value = "";
		

	}

//clears partner info input section
function clearPartnerFields() 
	{
		document.querySelectorAll("#PartnerInfo input[type='text']")
			.forEach(input => input.value = "");
	}

// hides partner info display until dropdown option selected
function updatePartnerDisplay()
	{
		const selected = document.getElementById("InvoiceeSelection").value;
		const display = document.getElementById("PartnerInfoDisplay");

		display.style.display = selected ? "block" : "none";

		[...display.children].forEach(block =>
			{
				block.style.display = (block.dataset.partner === selected) ? "block" : "none";
			});
	}

// Shows JIB allocator
function showAllocator()
	{
		const allocator = document.getElementById("JIBallocator");
		allocator.style.display = (allocator.style.display === "block") ? "none" : "block";
	}

// Shows JIB statements
function showJIBstatements()
	{
		const statements = document.getElementById("JIBstatements");
		statements.style.display = (statements.style.display === "block") ? "none" : "block";
	}

// Shows report
function showReport() { // Opens the show report page
	const report = document.getElementById("GenerateReport");
	report.style.display = (report.style.display === "block") ? "none" : "block";
	}
	

function exportTableToCsv(tableId) // Shows the csv report within an iframe
	{
		const table = document.getElementById(tableId);
		const csvData = [];
		const pdfRows = [];  

		for (let i = 0; i < table.rows.length; i++)
			{
				if (i === 1) continue;   // skips the input row of the table

				const rowValues = [];
				for (const cell of table.rows[i].cells)
					{
						rowValues.push(cell.innerText.trim());
					}
				csvData.push(rowValues.join(","));
				pdfRows.push(rowValues);
			}
		
		const csvContent = csvData.join("\n");
		const blob = new Blob([csvContent], { type: "text/plain;charset=utf-8" });
		


		currentCsvUrl = URL.createObjectURL(blob);
		document.getElementById("csvFrame").src = currentCsvUrl;




	const { jsPDF } = window.jspdf;  // Opens a pdf viewing window

	const doc = new jsPDF();

	const operatorName = document.getElementById("OperatorName").value.trim();

	const operatorAddressLine1 = document.getElementById("OperatorAddressLine1").value.trim();

	const operatorAddressLine2 = document.getElementById("OperatorAddressLine2").value.trim();

	const operatorAddressCity = document.getElementById("OperatorAddressCity").value.trim();

	const operatorAddressState = document.getElementById("OperatorAddressState").value.trim();
	
	const operatorAddressZipcode = document.getElementById("OperatorAddressZipcode").value.trim();

	const operatorContact = document.getElementById("OperatorContact").value.trim();

	const operatorWebsite = document.getElementById("OperatorWebsite").value.trim();

	doc.setFontSize(12);
	doc.text(operatorName || "Operator name not entered", 14, 25);

	let y = 31;

	if (operatorAddressLine1)
		{
			doc.text(operatorAddressLine1, 14, y);
			y += 6;
		}

	if (operatorAddressLine2)
		{
			doc.text(operatorAddressLine2, 14, y);
			y +=6;
		}		

	const cityState = [operatorAddressCity, operatorAddressState].filter(Boolean).join(", ");
	const cityStateZip = [cityState, operatorAddressZipcode].filter(Boolean).join(" ");

	if (cityStateZip)
		{
			doc.text(cityStateZip, 14, y);
			y +=6;
		}
	
	doc.setFontSize(16);
	doc.text("JIB Allocation Report", 14, 15);

	doc.autoTable
		(
			{
				head: [pdfRows[0]],
				body: pdfRows.slice(1),
				startY: y + 6,
				theme: "grid",
				headStyles: { fillColor: [31, 58, 95] },
				styles: { fontSize: 10 },
				didParseCell: function (data)
					{
						if (data.section === "body" && data.row.index === data.table.body.length - 1)
							{
								data.cell.styles.fontStyle = "bold";
							}
					},
				margin: { bottom: 25 }
			}
		);

	const pageCount = doc.getNumberOfPages();
	const pageW = doc.internal.pageSize.getWidth();
	const pageH = doc.internal.pageSize.getHeight();

	for (let p = 1; p <= pageCount; p++)
		{
			doc.setPage(p);
			doc.setFontSize(9);
			doc.setTextColor(100);
			doc.setDrawColor(200);
			doc.line(14, pageH - 20, pageW - 14, pageH - 20);

			if (operatorContact)
				{
					doc.text(operatorContact, 14, pageH - 14);
				}
			if (operatorWebsite)
				{	
					const websiteUrl = /^https?:\/\//i.test(operatorWebsite)
						? operatorWebsite
						: "https://" + operatorWebsite;
					doc.textWithLink(operatorWebsite, pageW - 14, pageH - 14, { url: websiteUrl, align: "right" });
					
				}
			doc.textWithLink("Created with JIB Allocator", 14, pageH - 8, { url: "https://yourwebsite.example" });
			doc.text("Page " + p + " of " + pageCount, pageW - 14, pageH - 8, { align: "right" });
		}

	doc.setTextColor(0);


	document.getElementById("pdfFrame").src = doc.output("bloburl");
	
	}

// Downloads CSV report
function downloadCsv(tableId, filename='JibAllocationCsv.csv')
	{
		const table = document.getElementById(tableId);
        const csvData = [];

        for (const row of table.rows)
            {
                const rowValues = [];
                for (const cell of row.cells)
                    {
                        rowValues.push(cell.innerText.trim());
                    }
                csvData.push(rowValues.join(","));
            }

        const csvContent = csvData.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();

        URL.revokeObjectURL(url);
	}



// adds row to the JIB statement table

let statementRowCount = 0;

function JibStatementAddRow(tableID, columnIndex) {

	
	const ExpenseCodeValue = document.getElementById("ExpenseCode").value.trim();
	const ExpenseDescripValue = document.getElementById("ExpenseDescrip").value.trim();
	const ExpenseSourceValue = document.getElementById("ExpenseSource").value.trim();
	const ExpenseDateValue = document.getElementById("ExpenseDate").value.trim();
	const ExpenseGrossAmountValue = document.getElementById("ExpenseGrossAmount").value.trim();
	
	const table = document.getElementById(tableID);
	const tbody = document.querySelector("#JIBstatement tbody");
	const rows = tbody.rows;

	const newRow =table.insertRow(2); // adding the input row to the table
		[ExpenseCodeValue, ExpenseDescripValue, ExpenseSourceValue, ExpenseDateValue, ExpenseGrossAmountValue, 0, ExpenseGrossAmountValue * 0]
			.forEach(v => {
				const cell = newRow.insertCell();
				cell.textContent = v;
			});

	rowCount++;

	const totalsRow = rows[rows.length - 1]; // calculate totals
	let workingInterestTotal = 0;
	let netAmountTotal = 0;
	
	for(let i = 0; i < rows.length - 1; i++)
		{
			workingInterestTotal += parseFloat(rows[i].cells[2].textContent) || 0;
			netAmountTotal += parseFloat(rows[i].cells[3].textContent) || 0;
		}


	totalsRow.cells[4].textContent = ExpenseGrossAmountValue;
	totalsRow.cells[5].textContent = 0;
	totalsRow.cells[6].textContent = 0;

	document.getElementById("ExpenseCode").value = ""; //reset table input row
	document.getElementById("ExpenseDescrip").value = "";
	document.getElementById("ExpenseSource").value = "";
	document.getElementById("ExpenseDate").value = "";
	document.getElementById("ExpenseGrossAmount").value = "";
		

	}


// shows JIB statement
function showStatement() { // Opens the show report page
	const report = document.getElementById("GenerateStatement");
	report.style.display = (report.style.display === "block") ? "none" : "block";
	}
	

function exportJibStatementToCsv(tableId) // Shows the csv report within an iframe
	{
		const table = document.getElementById(tableId);
		const csvData = [];
		const pdfRows = [];  

		for (let i = 0; i < table.rows.length; i++)
			{
				if (i === 1) continue;   // skips the input row of the table

				const rowValues = [];
				for (const cell of table.rows[i].cells)
					{
						rowValues.push(cell.innerText.trim());
					}
				csvData.push(rowValues.join(","));
				pdfRows.push(rowValues);
			}
		
		const csvContent = csvData.join("\n");
		const blob = new Blob([csvContent], { type: "text/plain;charset=utf-8" });
		


		currentCsvUrl = URL.createObjectURL(blob);
		document.getElementById("jibStatementCsvFrame").src = currentCsvUrl;




	const { jsPDF } = window.jspdf;  // Opens a pdf viewing window

	const doc = new jsPDF();

	const pageW = doc.internal.pageSize.getWidth();
	const pageH = doc.internal.pageSize.getHeight();

	const operatorName = document.getElementById("OperatorName").value.trim();

	const operatorAddressLine1 = document.getElementById("OperatorAddressLine1").value.trim();

	const operatorAddressLine2 = document.getElementById("OperatorAddressLine2").value.trim();

	const operatorAddressCity = document.getElementById("OperatorAddressCity").value.trim();

	const operatorAddressState = document.getElementById("OperatorAddressState").value.trim();
	
	const operatorAddressZipcode = document.getElementById("OperatorAddressZipcode").value.trim();

	const invoiceeName = document.getElementById("InvoiceeName").value.trim();

	const partnerAddressLine1 = document.getElementById("PartnerAddressLine1").value.trim();

	const partnerAddressLine2 = document.getElementById("PartnerAddressLine2").value.trim();

	const partnerAddressCity = document.getElementById("PartnerAddressCity").value.trim();

	const partnerAddressState = document.getElementById("PartnerAddressState").value.trim();

	const partnerAddressZipcode = document.getElementById("PartnerAddressZipcode").value.trim();

	const operatorContact = document.getElementById("OperatorContact").value.trim();

	const operatorWebsite = document.getElementById("OperatorWebsite").value.trim();

	const wellName = document.getElementById("WellName").value.trim();

	const apiNumber = document.getElementById("ApiNumber").value.trim();

	const billingPeriod = document.getElementById("BillingPeriod").value.trim();

	const statementNumber = document.getElementById("StatementNumber").value.trim();

	doc.setFontSize(12);

	const operatorCityState = [operatorAddressCity, operatorAddressState].filter(Boolean).join(", ");
	const operatorCityStateZip = [operatorCityState, operatorAddressZipcode].filter(Boolean).join(" ");

	const partnerCityState = [partnerAddressCity, partnerAddressState].filter(Boolean).join(", ");
	const partnerCityStateZip = [partnerCityState, partnerAddressZipcode].filter(Boolean).join(" ");

	const operatorLines = [
		operatorName || "Operator name not entered",
		operatorAddressLine1,
		operatorAddressLine2,
		operatorCityStateZip
	].filter(Boolean);
	
	const invoiceeLines = [
		invoiceeName || "Partner name not entered",
		partnerAddressLine1,
		partnerAddressLine2,
		partnerCityStateZip
	].filter(Boolean);

	const blockTop = 25;
	const lineHeight = 6;

	operatorLines.forEach((line, i) =>
		{
			doc.text(line, 14, blockTop + i * lineHeight);
		});

	invoiceeLines.forEach((line, i) =>
		{
			doc.text(line, pageW - 14, blockTop + i * lineHeight, { align: "right" });
		});

	let y = blockTop + Math.max(operatorLines.length, invoiceeLines.length) * lineHeight;

	

	doc.setFontSize(12);
	doc.text(apiNumber || "API number not entered", 14, y + 5);

	doc.setFontSize(12);
	doc.text(wellName || "Well name not entered", 14, y + 10);

	doc.setFontSize(12);
	doc.text(billingPeriod || "Billing period not entered", 14, y + 15);

	doc.setFontSize(12);
	doc.text(statementNumber || "Statement number not entered", 14, y + 20);

	doc.setFontSize(16);
	doc.text("JIB Statement", 14, 15);

	doc.autoTable
		(
			{
				head: [pdfRows[0]],
				body: pdfRows.slice(1),
				startY: y + 26,
				theme: "grid",
				headStyles: { fillColor: [31, 58, 95] },
				styles: { fontSize: 10 },
				didParseCell: function (data)
					{
						if (data.section === "body" && data.row.index === data.table.body.length - 1)
							{
								data.cell.styles.fontStyle = "bold";
							}
					},
				margin: { bottom: 25 }
			}
		);

	const pageCount = doc.getNumberOfPages();

	for (let p = 1; p <= pageCount; p++)
		{
			doc.setPage(p);
			doc.setFontSize(9);
			doc.setTextColor(100);
			doc.setDrawColor(200);
			doc.line(14, pageH - 20, pageW - 14, pageH - 20);

			if (operatorContact)
				{
					doc.text(operatorContact, 14, pageH - 14);
				}
			if (operatorWebsite)
				{	
					const websiteUrl = /^https?:\/\//i.test(operatorWebsite)
						? operatorWebsite
						: "https://" + operatorWebsite;
					doc.textWithLink(operatorWebsite, pageW - 14, pageH - 14, { url: websiteUrl, align: "right" });
					
				}
			doc.textWithLink("Created with JIB Allocator", 14, pageH - 8, { url: "https://yourwebsite.example" });
			doc.text("Page " + p + " of " + pageCount, pageW - 14, pageH - 8, { align: "right" });
		}

	doc.setTextColor(0);


	document.getElementById("jibStatementPdfFrame").src = doc.output("bloburl");
	
	}

// This shows the separate partners info

function showPartnerInfo()
	{
		const name = document.getElementById("InvoiceeName").value.trim();
		const line1 = document.getElementById("PartnerAddressLine1").value.trim();
		const line2 = document.getElementById("PartnerAddressLine2").value.trim();
		const city = document.getElementById("PartnerAddressCity").value.trim();
		const state = document.getElementById("PartnerAddressState").value.trim();
		const zip = document.getElementById("PartnerAddressZipcode").value.trim();
	
		if (!name)
			{
				alert("Please select a partner");
				return;
			}
		const cityState = [city, state].filter(Boolean).join(", ");
		const cityStateZip = [cityState, zip].filter(Boolean).join(" ");
		const lines = [name, line1, line2, cityStateZip].filter(Boolean);

		const display = document.getElementById("PartnerInfoDisplay");

		const existing = display.querySelector('[data-partner="' + CSS.escape(name) + '"]');
		if (existing) existing.remove();
		
		const block = document.createElement("p");
		block.dataset.partner = name;

		lines.forEach((line, i) =>
			{
				if (i > 0) block.appendChild(document.createElement("br"));
				block.appendChild(document.createTextNode(line));
			});
	
		display.appendChild(block);
	}
