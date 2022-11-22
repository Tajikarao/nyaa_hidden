const findMissing = num => {
    const max = Math.max(...num);
    const min = Math.min(...num);
    const missing = []
    var index = 0;
  
    if ((max - min) < 100){
        for(let i=min; i<= max; i++) {
            var miss = {}
            if(!num.includes(i)) {
                miss["index"] = index
                miss["id"] = i

                missing.push(miss);
            }

            index++;
        }
    }
    
    return missing;
  }

var torrent_list = document.querySelectorAll(".torrent-list > tbody > tr");

if (torrent_list.length){

    var ids = []

    torrent_list.forEach(function (tr, index) {

        var td = tr.querySelector("td:nth-child(2)");
        
        if (td){
            var a = td.querySelector("a:nth-child(1)").getAttribute("href");
            a = a.replace("/view/", '').replace("#comments", '');
            ids.push(parseInt(a));
        }
        

    });

    ids = ids.sort(function (a, b) {  return a - b;  });


    var missing_ids = findMissing(ids);

    var torrent_table = document.querySelector(".torrent-list > tbody");

    missing_ids.forEach(function (miss, index) {
        fetch("https://nyaa.si/view/" + miss["id"])
        .then(response => {
            if (response.status != 200) throw { code: response.status }
            return response.text()
        })
        .then(text => {
            var cat = text.split('- <a href="/?c=')[1].split('">')[0].trim()
            var cat_text = text.split(cat + '">')[1].split('</a>')[0].trim()

            var cat_cell = document.createElement("td");
            var cat_cell_a = document.createElement('a');
            cat_cell_a.setAttribute('title', cat_text);
            cat_cell_a.setAttribute('href', '/?c=' + cat);

            var cat_cell_a_img = document.createElement("img");
            cat_cell_a_img.setAttribute('src', '/static/img/icons/nyaa/' + cat + '.png');
            cat_cell_a_img.classList.add("category-icon")


            cat_cell_a.appendChild(cat_cell_a_img);
            cat_cell.appendChild(cat_cell_a);


            var title = text.split('<h3 class="panel-title">')[1].split('</h3>')[0].trim()
            var num_comment = parseInt(text.split('Comments - ')[1].split('<')[0].trim())
            var title_cell = document.createElement("td");
            title_cell.setAttribute('colspan', "2");

            if (num_comment){
                var title_cell_comment_a = document.createElement("a");
                title_cell_comment_a.setAttribute('href', '/view/' + miss["id"] + '#comments');
                title_cell_comment_a.classList.add('comments')
                title_cell_comment_a.innerText == num_comment;


                var title_cell_comment_a_i = document.createElement("i");
                title_cell_comment_a_i.classList.add("fa fa-comments-o");
                title_cell_comment_a.appendChild(title_cell_comment_a_i);


                title_cell.appendChild(title_cell_comment_a);
            }

            
            var title_cell_a = document.createElement("a");
            title_cell_a.setAttribute('href', '/view/' + miss["id"]);
            title_cell_a.setAttribute('title', title);
            var title_cell_a_text = document.createTextNode(title);

            title_cell_a.appendChild(title_cell_a_text);

            title_cell.appendChild(title_cell_a);


            var link_cell = document.createElement('td');
            link_cell.classList.add('text-center');

            var torrent = "/download/" + miss["id"] + ".torrent"
            var magnet = text.split('</a> or <a href="')[1].split('" class="')[0].trim()

            var link_cell_torrent = document.createElement("a");
            link_cell_torrent.setAttribute('href', torrent);

            var link_cell_torrent_i = document.createElement("i");
            link_cell_torrent_i.classList.add("fa");
            link_cell_torrent_i.classList.add("fa-fw");
            link_cell_torrent_i.classList.add("fa-download");

            link_cell_torrent.appendChild(link_cell_torrent_i);

            var link_cell_magnet = document.createElement("a");
            link_cell_magnet.setAttribute('href', magnet);

            var link_cell_magnet_i = document.createElement("i");
            link_cell_magnet_i.classList.add("fa");   
            link_cell_magnet_i.classList.add("fa-fw");
            link_cell_magnet_i.classList.add("fa-magnet");

            link_cell_magnet.appendChild(link_cell_magnet_i);

            link_cell.appendChild(link_cell_torrent);
            link_cell.appendChild(link_cell_magnet);


            var file_size = text.split('File size:</div>')[1].split('<div class="col-md-5">')[1].split('</div>')[0].trim()

            var size_cell = document.createElement('td');
            size_cell.classList.add('text-center');

            var size_cell_text = document.createTextNode(file_size);

            size_cell.appendChild(size_cell_text);

            

            var time = text.split('Date:</div>')[1].split('">')[1].split(' UTC</div>')[0].trim()
            time = new Date(time + ' UTC');

            hour = time.getHours();
            mins = time.getMinutes();

            time = time.toLocaleDateString() + " " + hour + ":" + mins

            var time_cell = document.createElement('td');
            time_cell.classList.add('text-center');

            var time_cell_text = document.createTextNode(time);

            time_cell.appendChild(time_cell_text);


            var seeders = text.split('<span style="color: green;">')[1].split('</span>')[0].trim()

            var seeders_cell = document.createElement('td');
            seeders_cell.classList.add('text-center');

            var seeders_cell_text = document.createTextNode(seeders);

            seeders_cell.appendChild(seeders_cell_text);


            var leechers = text.split('<span style="color: red;">')[1].split('</span>')[0].trim()

            var leechers_cell = document.createElement('td');
            leechers_cell.classList.add('text-center');

            var leechers_cell_text = document.createTextNode(leechers);

            leechers_cell.appendChild(leechers_cell_text);


            var completed = text.split('Completed:</div>')[1].split('<div class="col-md-5">')[1].split('</div>')[0].trim()

            var completed_cell = document.createElement('td');
            completed_cell.classList.add('text-center');

            var completed_cell_text = document.createTextNode(completed);

            completed_cell.appendChild(completed_cell_text);

            var row = torrent_table.insertRow(ids.length -  miss["index"]);
            row.classList.add("warning")

            row.appendChild(cat_cell);
            row.appendChild(title_cell);
            row.appendChild(link_cell);
            row.appendChild(size_cell);
            row.appendChild(time_cell);
            row.appendChild(seeders_cell);
            row.appendChild(leechers_cell);
            row.appendChild(completed_cell);
        })
        .catch()
    });

}
