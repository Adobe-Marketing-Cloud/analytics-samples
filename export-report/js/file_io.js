function readSingleFile(event) {
	var file = event.target.files[0];
	if (file) {
		try {
			var reader = new FileReader();
			var contents;
			reader.onload = function (e) {
				contents = e.target.result;
				window.fileData = contents;
			}
		} catch (e) { alert("you should use browser with FileReader Support!"); }
		reader.readAsText(file);

	} else {
		alert("Failed to load file");
	}
}

function downloadSingleFile(text, name, type) {

	var a = document.getElementById("a");
	var file = new Blob([text], {
			type : type
		});
	a.href = URL.createObjectURL(file);
	a.download = name;
	a.click();
}
