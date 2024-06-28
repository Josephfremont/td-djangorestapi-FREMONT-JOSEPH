import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, IconButton, TableContainer, TableHead, TableRow, Paper, CircularProgress, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { DateField } from '@mui/x-date-pickers/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import getProjets from '../../api/getProjets';
import getChercheurs from '../../api/getChercheurs';
import deleteProjets from '../../api/deleteProjets';
import putProjets from '../../api/putProjets';
import postProjets from '../../api/postProjets';

import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import UpdateIcon from '@mui/icons-material/Update';
import Alert from '@mui/material/Alert';

dayjs.extend(customParseFormat);

const TableDataProjetRecherche = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [projets, setProjets] = useState([]);
    const [chercheurs, setChercheurs] = useState([]);
    const [sortColumn, setSortColumn] = useState('titre');
    const [sortOrder, setSortOrder] = useState('asc');
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [selectedProjet, setSelectedProjet] = useState(null);

    const isAuthenticated = localStorage.getItem("token");

    const getData = () => {
        setLoading(true);
        Promise.all([
            getProjets(isAuthenticated),
            getChercheurs(isAuthenticated)
        ])
        .then(([projetsData, chercheursData]) => {
            setProjets(projetsData);
            setChercheurs(chercheursData);
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

    const handleRemoveClick = (projet) => {
        deleteProjets(isAuthenticated, projet.id)
            .then(() => {
                window.alert(projet.titre + " a été supprimé avec succès");
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

    const handleUpdateClick = (projet) => {
        setSelectedProjet(projet);
        setOpenUpdateDialog(true);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const sortedData = [...projets].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true);
        setSelectedProjet(null); // Réinitialiser les champs du formulaire lors de la création d'un nouveau projet
    };

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
        setSelectedProjet(null);
    };

    const handleCreateProjet = () => {
        if (selectedProjet) {
            postProjets(isAuthenticated, selectedProjet)
                .then(() => {
                    window.alert(selectedProjet.titre + " a été créé avec succès");
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
        setSelectedProjet(null);
    };

    const handleUpdateProjet = () => {
        if (selectedProjet) {
            putProjets(isAuthenticated, selectedProjet)
                .then(() => {
                    window.alert(selectedProjet.titre + " a été mis à jour avec succès");
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
            <h1>Projets de Recherche</h1>
            <p>Vous pouvez trier les éléments en cliquant sur la colonne</p>
            {error && <p>{error}</p>}
            {!loading ? (
                <>
                    <Alert severity="warning">Touts les champs sont obligatoire lors de la création et l'update sauf pour <b>description</b>.</Alert>
                    <Alert severity="info">Veillez faire d'abord un <b>chercheur</b> avant de faire un projet si il n'y a aucune donnée.</Alert>
                    <Button variant="outlined" color="success" onClick={handleOpenCreateDialog}>
                        Créer
                    </Button>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell onClick={() => handleSort('titre')}><b>Titre</b></TableCell>
                                    <TableCell onClick={() => handleSort('description')}><b>Description</b></TableCell>
                                    <TableCell onClick={() => handleSort('date_debut')}><b>Date Début</b></TableCell>
                                    <TableCell onClick={() => handleSort('date_fin_prevue')}><b>Date Fin Prévue</b></TableCell>
                                    <TableCell><b>Chef Projet</b></TableCell>
                                    <TableCell><b>Actions</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedData.map((projet) => (
                                    <TableRow key={projet.id}>
                                        <TableCell>{projet.titre}</TableCell>
                                        <TableCell>{projet.description}</TableCell>
                                        <TableCell>{convertDateFR(projet.date_debut)}</TableCell>
                                        <TableCell>{convertDateFR(projet.date_fin_prevue)}</TableCell>
                                        <TableCell>
                                            {
                                                chercheurs && chercheurs.find((unChercheur) => unChercheur.id == projet.chef_projet).nom
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleUpdateClick(projet)}>
                                                <UpdateIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleRemoveClick(projet)}>
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

                    <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
                        <DialogTitle>Créer un projet</DialogTitle>
                        <DialogContent>
                            <form>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="titre"
                                    label="Titre"
                                    fullWidth
                                    value={selectedProjet ? selectedProjet.titre : ''}
                                    onChange={(e) => setSelectedProjet({ ...selectedProjet, titre: e.target.value })}
                                />
                                <TextField
                                    margin="dense"
                                    id="description"
                                    label="Description"
                                    fullWidth
                                    value={selectedProjet ? selectedProjet.description : ''}
                                    onChange={(e) => setSelectedProjet({ ...selectedProjet, description: e.target.value })}
                                />

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <DateField
                                    label="Date Début"
                                    value={selectedProjet && selectedProjet.date_debut ? dayjs(selectedProjet.date_debut) : null}
                                    onChange={(e) => setSelectedProjet({ ...selectedProjet, date_debut: e ? `${e.$y}-${e.$M + 1}-${e.$D}` : null })}
                                    format="DD-MM-YYYY"
                                  />
                                </LocalizationProvider>

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <DateField
                                    label="Date Fin Prévue"
                                    value={selectedProjet && selectedProjet.date_fin_prevue ? dayjs(selectedProjet.date_fin_prevue) : null}
                                    onChange={(e) => setSelectedProjet({ ...selectedProjet, date_fin_prevue: e ? `${e.$y}-${e.$M + 1}-${e.$D}` : null })}
                                    format="DD-MM-YYYY"
                                  />
                                </LocalizationProvider>

                                <FormControl fullWidth margin="dense">
                                    <InputLabel id="chef-projet-label">Chef de Projet</InputLabel>
                                    <Select
                                        labelId="chef-projet-label"
                                        id="chef_projet"
                                        value={selectedProjet ? selectedProjet.chef_projet : ''}
                                        onChange={(e) => setSelectedProjet({ ...selectedProjet, chef_projet: e.target.value })}
                                    >
                                        {chercheurs && chercheurs.map((chercheur) => (
                                            <MenuItem key={chercheur.id} value={chercheur.id}>{chercheur.nom}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseCreateDialog} color="secondary">
                                Annuler
                            </Button>
                            <Button onClick={handleCreateProjet} color="primary">
                                Créer
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
                        <DialogTitle>Mettre à jour le projet</DialogTitle>
                        <DialogContent>
                            <form>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="titre"
                                    label="Titre"
                                    fullWidth
                                    value={selectedProjet ? selectedProjet.titre : ''}
                                    onChange={(e) => setSelectedProjet({ ...selectedProjet, titre: e.target.value })}
                                />
                                <TextField
                                    margin="dense"
                                    id="description"
                                    label="Description"
                                    fullWidth
                                    value={selectedProjet ? selectedProjet.description : ''}
                                    onChange={(e) => setSelectedProjet({ ...selectedProjet, description: e.target.value })}
                                />

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <DateField
                                    label="Date Début"
                                    value={selectedProjet && selectedProjet.date_debut ? dayjs(selectedProjet.date_debut) : null}
                                    onChange={(e) => setSelectedProjet({ ...selectedProjet, date_debut: e ? `${e.$y}-${e.$M + 1}-${e.$D}` : null })}
                                    format="DD-MM-YYYY"
                                  />
                                </LocalizationProvider>

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <DateField
                                    label="Date Fin Prévue"
                                    value={selectedProjet && selectedProjet.date_fin_prevue ? dayjs(selectedProjet.date_fin_prevue) : null}
                                    onChange={(e) => setSelectedProjet({ ...selectedProjet, date_fin_prevue: e ? `${e.$y}-${e.$M + 1}-${e.$D}` : null })}
                                    format="DD-MM-YYYY"
                                  />
                                </LocalizationProvider>

                                <FormControl fullWidth margin="dense">
                                    <InputLabel id="chef-projet-label">Chef de Projet</InputLabel>
                                    <Select
                                        labelId="chef-projet-label"
                                        id="chef_projet"
                                        value={selectedProjet ? selectedProjet.chef_projet : ''}
                                        onChange={(e) => setSelectedProjet({ ...selectedProjet, chef_projet: e.target.value })}
                                    >
                                        {chercheurs && chercheurs.map((chercheur) => (
                                            <MenuItem key={chercheur.id} value={chercheur.id}>{chercheur.nom}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseUpdateDialog} color="secondary">
                                Annuler
                            </Button>
                            <Button onClick={handleUpdateProjet} color="primary">
                                Mettre à jour
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            ): (
                <CircularProgress />
                ) }
        </div>
    );
};

export default TableDataProjetRecherche;
