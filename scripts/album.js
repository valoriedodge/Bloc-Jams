
var getSongNumberCell = function (number){
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     var $row = $(template);
     var onHover = function (event){
        var song = $(this).find('.song-item-number');
        var songNumber = parseInt(song.attr('data-song-number'));
        if (songNumber !== currentlyPlayingSongNumber){
            song.html(playButtonTemplate);
        }
     };
     var offHover = function (event){
         var song = $(this).find('.song-item-number');
         var songNumber = parseInt(song.attr('data-song-number'));
         console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
         if (songNumber !== currentlyPlayingSongNumber){
             song.html(songNumber);
          }
     };
    
     var clickHandler = function(){
         var songNumber = parseInt($(this).attr('data-song-number'));

         if (currentlyPlayingSongNumber === null) {
             $(this).html(pauseButtonTemplate);
             currentlyPlayingSongNumber = songNumber;
         } else if (currentlyPlayingSongNumber === songNumber) {
             $(this).html(playButtonTemplate);
             currentlyPlayingSongNumber = null;
         } else if (currentlyPlayingSongNumber !== songNumber) {
             var currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
             currentlyPlayingSongElement.html(currentlyPlayingSongElement.attr('data-song-number'));
             $(this).html(pauseButtonTemplate);
             currentlyPlayingSongNumber = songNumber;
         }
         currentlyPlayingSongNumber ? (currentSongFromAlbum = currentAlbum.songs[songNumber - 1]) : (currentSongFromAlbum = null);
         updatePlayerBarSong();
     };
     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
     return $row;
 };
 
var setSong = function(songNumber) {
    currentlyPlayingSongNumber = songNumber;
    currentSongFromAlbum = currentAlbum.songs[songNumber-1];
};


var setCurrentAlbum = function(album) {
     currentAlbum = album;
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
 
     $albumSongList.empty();
 
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};
var changeSong = function(number) {
    var album = currentAlbum;
    var song = currentSongFromAlbum;
    var lastSongNumber = currentlyPlayingSongNumber;
    var lastSongIndex = trackIndex(album, song);
    
    if (number > 0 ){
        var currentSongIndex = lastSongIndex + 1;

        if (currentSongIndex >= album.songs.length) {
            currentSongIndex = 0;
        }
    }
    
    if (number < 0){
        var currentSongIndex = lastSongIndex - 1;

        if (currentSongIndex < 0) {
            currentSongIndex = album.songs.length - 1;
        }
    }
    
    setSong(currentSongIndex + 1);
    updatePlayerBarSong();
    
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};

var updatePlayerBarSong = function(){
    if (currentlyPlayingSongNumber) {
        $('.currently-playing .song-name').text(currentSongFromAlbum.title);
        $('.currently-playing .artist-name').text(currentAlbum.artist);
        $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
        $('.main-controls .play-pause').html(playerBarPauseButton);
    } else {
        $('.main-controls .play-pause').html(playerBarPlayButton);
    }
   
};
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next')

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(function(){
        changeSong(-1);
    });
    $nextButton.click(function(){
        changeSong(1);
    });
 });
