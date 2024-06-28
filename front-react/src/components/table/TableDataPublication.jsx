import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, IconButton, TableContainer, TableHead, TableRow, Paper, CircularProgress, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { DateField } from '@mui/x-date-pickers/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import getProjets from '../../api/getProjets';
import getPublications from '../../api/getPublications';
import deletePublications from '../../api/deletePublications';
import putPublications from '../../api/putPublications';
import postPublications from '../../api/postPublications';

import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import UpdateIcon from '@mui/icons-material/Update';
import Alert from '@mui/material/Alert';

dayjs.extend(customParseFormat);

const TableDataPublication = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [publications, setPublications] = useState([]);
    const [projets, setProjets] = useState([]);
    const [sortColumn, setSortColumn] = useState('titre');
    const [sortOrder, setSortOrder] = useState('asc');
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [selectedPublication, setSelectedPublication] = useState(null);

    const isAuthenticated = localStorage.getItem("token");

    const getData = () => {
        setLoading(true);
        Promise.all([getPublications(isAuthenticated), getProjets(isAuthenticated)])
            .then(([publicationsData, projetsData]) => {
                setPublications(publicationsData);
                setProjets(projetsData);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        getData();
    }, [isAuthenticated]);

    const handleRemoveClick = (publication) => {
        deletePublications(isAuthenticated, publication.id)
            .then(() => {
                window.alert(publication.titre + " a été supprimé avec succès");
                getData();
            })
            .catch((err) => {
                window.alert("Erreur : " + err);
            });
    };

    const handleSort = (column) => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortOrder(newSortOrder);
    };

    const handleUpdateClick = (publication) => {
        setSelectedPublication(publication);
        setOpenUpdateDialog(true);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const sortedData = [...publications].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true);
        setSelectedPublication(null); // Réinitialiser les champs du formulaire lors de la création d'une nouvelle publication
    };

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
        setSelectedPublication(null);
    };

    const handleCreatePublication = () => {
        if (selectedPublication) {
            postPublications(isAuthenticated, selectedPublication)
                .then(() => {
                    window.alert(selectedPublication.titre + " a été créé avec succès");
                    handleCloseCreateDialog();
                    getData();
                })
                .catch((err) => {
                    window.alert("Erreur : " + err);
                });
        }
    };

    const handleOpenUpdateDialog = () => {
        setOpenUpdateDialog(true);
    };

    const handleCloseUpdateDialog = () => {
        setOpenUpdateDialog(false);
        setSelectedPublication(null);
    };

    const handleUpdatePublication = () => {
        if (selectedPublication) {
            putPublications(isAuthenticated, selectedPublication)
                .then(() => {
                    window.alert(selectedPublication.titre + " a été mis à jour avec succès");
                    handleCloseUpdateDialog();
                    getData();
                })
                .catch((err) => {
                    window.alert("Erreur : " + err);
                });
        }
    };

    // partie date
    const convertDateFR = (date) => {
        const formattedDate = dayjs(date).format('DD-MM-YYYY');
        return formattedDate;
    };

    return (
        <div>
            <h1>Publications</h1>
            <p>Vous pouvez trier les éléments en cliquant sur la colonne</p>
            {error && <p>{error}</p>}
            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    <Alert severity="warning"><b>Touts les champs</b> sont obligatoire.</Alert>
                    <Alert severity="info">Veillez faire d'abord un <b>projet</b> avant de faire une publication si il n'y a aucune donnée.</Alert>
                    <Button variant="outlined" color="success" onClick={handleOpenCreateDialog}>
                        Créer
                    </Button>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell onClick={() => handleSort('titre')}><b>Titre</b></TableCell>
                                    <TableCell onClick={() => handleSort('resume')}><b>Résumé</b></TableCell>
                                    <TableCell onClick={() => handleSort('projet_associe')}><b>Projet Associé</b></TableCell>
                                    <TableCell onClick={() => handleSort('date_publication')}><b>Date Publication</b></TableCell>
                                    <TableCell><b>Actions</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedData.map((publication) => (
                                    <TableRow key={publication.id}>
                                        <TableCell>{publication.titre}</TableCell>
                                        <TableCell>{publication.resume}</TableCell>
                                        <TableCell>
                                            {
                                                projets && projets.find((projet) => projet.id == publication.projet_associe).titre
                                            }
                                        </TableCell>
                                        
                                        <TableCell>{convertDateFR(publication.date_publication)}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleUpdateClick(publication)}>
                                                <UpdateIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleRemoveClick(publication)}>
                                                <RemoveCircleOutlineIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={sortedData.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[3, 5, 10]}
                    />

                    {/* Pop-up pour créer une publication */}
                    <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
                        <DialogTitle>Créer une publication</DialogTitle>
                        <DialogContent>
                            {/* Formulaire pour créer une publication */}
                            <form>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="titre"
                                    label="Titre"
                                    fullWidth
                                    value={selectedPublication ? selectedPublication.titre : ''}
                                    onChange={(e) => setSelectedPublication({ ...selectedPublication, titre: e.target.value })}
                                />
                                <TextField
                                    margin="dense"
                                    id="resume"
                                    label="Résumé"
                                    fullWidth
                                    value={selectedPublication ? selectedPublication.resume : ''}
                                    onChange={(e) => setSelectedPublication({ ...selectedPublication, resume: e.target.value })}
                                />
                                <FormControl fullWidth margin="dense">
                                    <InputLabel id="projet-associe-label">Projet Associé</InputLabel>
                                    <Select
                                        labelId="projet-associe-label"
                                        id="projet_associe"
                                        value={selectedPublication ? selectedPublication.projet_associe : ''}
                                        onChange={(e) => setSelectedPublication({ ...selectedPublication, projet_associe: e.target.value })}
                                    >
                                        {projets.map((projet) => (
                                            <MenuItem key={projet.id} value={projet.id}>
                                                {projet.titre}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <DateField
                                    label="Date de Publication"
                                    value={selectedPublication && selectedPublication.date_publication ? dayjs(selectedPublication.date_publication) : null}
                                    onChange={(e) => setSelectedPublication({ ...selectedPublication, date_publication: e ? `${e.$y}-${e.$M + 1}-${e.$D}` : null })}
                                    format="DD-MM-YYYY"
                                  />
                                </LocalizationProvider>
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseCreateDialog} color="secondary">
                                Annuler
                            </Button>
                            <Button onClick={handleCreatePublication} color="primary">
                                Créer
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
                        <DialogTitle>Mettre à jour la publication</DialogTitle>
                        <DialogContent>
                            <form>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="titre"
                                    label="Titre"
                                    fullWidth
                                    value={selectedPublication ? selectedPublication.titre : ''}
                                    onChange={(e) => setSelectedPublication({ ...selectedPublication, titre: e.target.value })}
                                />
                                <TextField
                                    margin="dense"
                                    id="resume"
                                    label="Résumé"
                                    fullWidth
                                    value={selectedPublication ? selectedPublication.resume : ''}
                                    onChange={(e) => setSelectedPublication({ ...selectedPublication, resume: e.target.value })}
                                />
                                <FormControl fullWidth margin="dense">
                                    <InputLabel id="projet-associe-label">Projet Associé</InputLabel>
                                    <Select
                                        labelId="projet-associe-label"
                                        id="projet_associe"
                                        value={selectedPublication ? selectedPublication.projet_associe : ''}
                                        onChange={(e) => setSelectedPublication({ ...selectedPublication, projet_associe: e.target.value })}
                                    >
                                        {projets.map((projet) => (
                                            <MenuItem key={projet.id} value={projet.id}>
                                                {projet.titre}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <DateField
                                    label="Date de Publication"
                                    value={selectedPublication && selectedPublication.date_publication ? dayjs(selectedPublication.date_publication) : null}
                                    onChange={(e) => setSelectedPublication({ ...selectedPublication, date_publication: e ? `${e.$y}-${e.$M + 1}-${e.$D}` : null })}
                                    format="DD-MM-YYYY"
                                  />
                                </LocalizationProvider>
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseUpdateDialog} color="secondary">
                                Annuler
                            </Button>
                            <Button onClick={handleUpdatePublication} color="primary">
                                Mettre à jour
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </div>
    );
};

export default TableDataPublication;
