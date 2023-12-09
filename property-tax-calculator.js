window.onload = function () {
  const millageRatesJsonUrl = '/wp-content/scripts/millage-rates-2023.json';
  const ownerOccupantRate = 0.04; // 4%
  const allOtherRate = 0.06; // 6%

  const homeValueInput = document.getElementById('homeValue');
  const taxDistrictSelect = document.getElementById('taxDistrict');
  const estimateButton = document.getElementById('calculateTax');
  const estimatedTaxParagraph = document.getElementById('estimatedTax');

  function calculateTax() {
    const homeValue = parseFloat(homeValueInput.value);
    const taxDistrictId = parseInt(taxDistrictSelect.value);
    const isOwnerOccupant = document.getElementById('ownerOccupant').checked;

    fetch(millageRatesJsonUrl)
      .then(response => response.json())
      .then(data => {
        const selectedTaxDistrict = data.taxDistricts.find(district => district.id === taxDistrictId);
        const millageRate = selectedTaxDistrict.millageRate;
        let taxRate;

        if (isOwnerOccupant) {
          taxRate = ownerOccupantRate + selectedTaxDistrict.cityTaxRelief;
        } else {
          taxRate = allOtherRate;
        }

        const estimatedTax = homeValue * taxRate * millageRate;

        estimatedTaxParagraph.textContent = `Estimated Property Tax: $${estimatedTax.toFixed(2)}`;
      })
      .catch(error => {
        console.error(error);
        estimatedTaxParagraph.textContent = 'Error: Unable to calculate estimated tax.';
      });
  }

  estimateButton.addEventListener('click', calculateTax);

  // Populate the tax district dropdown menu
  fetch(millageRatesJsonUrl)
    .then(response => response.json())
    .then(data => {
      data.taxDistricts.forEach(district => {
        const option = document.createElement('option');
        option.value = district.id;
        option.textContent = district.name;
        taxDistrictSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error(error);
    });
};
