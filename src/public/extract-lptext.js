async function extractLPText(req, res) {
  const files = document.getElementById('image').files;
  if (files.length === 0) {
    return alert('Please select an image');
  }

  const formData = new FormData();

  const file = document.getElementById('image').files[0];
  formData.append('image', file, file.name);

  try {
    const response = await axios.post('http://localhost:3001', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    const {area, number} = await response.data;

    document.getElementById('license-number').value = area + ' ' + number;
  } catch (err) {
    console.error(err);
  }
}
